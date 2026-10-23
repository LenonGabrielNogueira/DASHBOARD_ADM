# AGENTS.md: Dashboard Administrativo Organizacional

Este arquivo é o manual do agente. **Leia inteiro antes de qualquer tarefa.** Em caso de conflito entre este arquivo e uma instrução solta na conversa, siga este arquivo e avise o conflito.

## 1. Contexto do projeto

Dashboard administrativo multi-tenant (várias organizações no mesmo sistema) com:
pessoas, departamentos, cargos, **organograma interativo**, **métricas históricas** (headcount, admissões, desligamentos), auditoria, permissões e relatórios.

Documentos de referência:
- `docs/guia-dashboard-admin.md`: visão geral, decisões de arquitetura e esboços de código. **Os trechos são esboços**, não a versão final. Adapte, não copie às cegas.
- `prisma/schema.prisma`: fonte da verdade do modelo de dados.
- `TASKS.md`: lista de tarefas. **Trabalhe em UMA tarefa por vez.**
- `docs/DECISIONS.md`: registre aqui toda decisão que não estava especificada.

## 2. Stack

Next.js (App Router) · TypeScript estrito · Tailwind + shadcn/ui · Prisma · PostgreSQL (Neon) · Clerk (Organizations) · Inngest · TanStack Table · React Hook Form + Zod · Recharts · React Flow (`@xyflow/react`) + dagre · nuqs · Vitest · Playwright · Vercel.

**Versões:** use as versões instaladas em `package.json`. As APIs de Next.js, Prisma, Clerk e Inngest mudam entre versões (exemplos: `middleware.ts` vs `proxy.ts`, config do datasource do Prisma, sintaxe de cron do Inngest). **Antes de usar uma API dessas bibliotecas, confira a documentação da versão instalada.** Nunca use uma API de memória sem verificar.

## 3. Comandos

> Se um script ainda não existir, crie-o na tarefa T1.1 e mantenha esta lista atualizada.

```bash
npm run dev          # servidor de desenvolvimento
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Vitest (unitários e integração)
npm run test:e2e     # Playwright
npm run db:migrate   # prisma migrate dev
npm run db:seed      # prisma db seed
npm run db:studio    # prisma studio
npm run check:raw    # verifica $queryRaw sem organizationId (ver T3.6)
```

## 4. Regras invioláveis

Estas regras protegem dados entre organizações e a integridade do histórico. Violá-las é um bug grave, mesmo que "funcione".

### 4.1 Multi-tenant
1. Todo registro de negócio tem `organizationId`.
2. Em `features/`, `app/` e `inngest/`: **nunca importe `prisma` direto.** Use `tenantDb(organizationId)` de `src/lib/tenant.ts`. Só `src/lib/db.ts`, `src/lib/tenant.ts` e `prisma/seed.ts` importam o cliente cru.
3. O `organizationId` vem **sempre de `getContext()`** (sessão do servidor), **nunca** de parâmetro, body, query string ou campo de formulário.
4. Para alterar ou remover por `id`: use `updateMany`/`deleteMany` com `where: { id }` (o `tenantDb` injeta `organizationId`) e confirme `count === 1`, ou faça um `findFirst` prévio. Não use `update`/`delete` por chave única sem essa garantia.
5. Toda `$queryRaw` deve ter `WHERE "organizationId" = ${organizationId}` escrito explicitamente em **todas** as tabelas do `FROM`/`JOIN` e em cada ramo de CTE recursiva. O script `check:raw` verifica isso.
6. Jobs do Inngest recebem `organizationId` no evento e o aplicam da mesma forma.

### 4.2 Toda Server Action e rota de API segue esta ordem
1. `getContext()`
2. `assertCan(role, permissão)`
3. Validação com Zod (schema em `features/<domínio>/schemas.ts`)
4. Regras de negócio
5. Escrita (em `$transaction` quando tocar mais de uma tabela)
6. `audit(...)`
7. `revalidatePath`/`revalidateTag`

Sem os passos 2, 3 e 6 a tarefa **não está pronta**.

### 4.3 Dados e histórico
- **Soft delete** (`deletedAt`) em pessoas, departamentos e cargos. Nunca `delete` físico dessas entidades em código de aplicação.
- **Mudança de cargo/departamento** fecha o `PersonAssignment` vigente (`endDate`) e abre outro (`startDate`) **na mesma transação**. Nunca edite cargo/departamento "no lugar".
- **Sem ciclos na hierarquia:** ao definir `managerId`, valide que a pessoa não é ancestral do novo gestor.
- **Desligar uma pessoa:** exige destino (novo gestor) para os subordinados diretos. Fecha o assignment vigente e preenche `terminatedAt`.
- `AuditLog` é **append-only**: só `create`.
- Métricas do dashboard **leem `MetricSnapshot`**; nunca calcule histórico em tempo real na requisição.

### 4.4 Segurança
- Nunca registre segredos, tokens ou dados pessoais em logs, auditoria ou mensagens de erro.
- Nunca commite `.env*` (exceto `.env.example`, sem valores).
- Verifique a assinatura (Svix) em todo webhook antes de processar.
- Mensagens de erro para o usuário não vazam detalhes internos.

## 5. Convenções de código

### 5.1 Estrutura
```
src/
├── app/                  # rotas (finas): só compõem features
├── features/<domínio>/   # components/, actions.ts, queries.ts, schemas.ts (+ testes ao lado)
├── components/           # ui/ (shadcn), data-table/, charts/, layout/
├── lib/                  # db.ts, tenant.ts, auth.ts, permissions.ts, audit.ts, utils.ts
├── inngest/              # client.ts, functions/
└── types/
```
- Lógica de domínio **não** fica em `app/` nem em componentes. Fica em `features/<domínio>/`.
- `queries.ts` = leitura (usada em Server Components). `actions.ts` = escrita (Server Actions, `"use server"`).

### 5.2 TypeScript
- `strict` ligado. **Proibido** `any` sem comentário justificando (exceção conhecida: a extensão do `tenantDb`).
- Tipos de entrada derivados do Zod: `z.infer<typeof schema>`.
- Resultado de action tipado: `{ ok: true, data } | { ok: false, error }`. Não lance exceção para erro esperado de validação.

### 5.3 UI
- Server Components por padrão; `"use client"` só onde há interatividade.
- Filtros, ordenação, paginação e período ficam **na URL** (`nuqs`) e são aplicados **no servidor**.
- Toda tela de dados tem estados de **loading** (Skeleton), **vazio** e **erro**.
- Responsivo: nada de scroll horizontal no body; tabelas largas rolam dentro do próprio container.
- Acessibilidade básica: labels em campos, foco visível, contraste adequado.
- Gráficos: um gráfico responde uma pergunta. Título claro, unidade nos eixos, sem decoração.
- Textos de interface em **português do Brasil**. Identificadores de código em inglês.

### 5.4 Banco
- Mudança de schema = nova migration (`prisma migrate dev --name <descrição>`). Nunca edite migration já aplicada.
- Regras que o Prisma não modela (como a exclusion constraint de assignments) vão em migration SQL manual versionada.
- Índices compostos começam por `organizationId`.
- Use a URL com pooler no app (`DATABASE_URL`) e a direta para migrations (`DIRECT_URL`).

### 5.5 Testes
- Regra de negócio nova → teste unitário (Vitest) no mesmo PR.
- Teste de **isolamento de tenant** é obrigatório para toda nova query ou action de escrita que toque dados de negócio.
- Cálculo de métricas: teste comparando o resultado com uma contagem independente sobre dados conhecidos.
- Não apague nem enfraqueça um teste para fazer o build passar. Se achar que o teste está errado, pare e explique.

### 5.6 Git
- Uma branch por tarefa: `feat/T5.2-people-actions`.
- Commits pequenos, mensagem no formato `tipo(escopo): descrição` (`feat`, `fix`, `test`, `chore`, `docs`).
- PR com: o que mudou, como testar, checklist da seção 7.

## 6. Como trabalhar

1. Leia a tarefa em `TASKS.md` e os arquivos que ela manda ler. Não leia nem implemente outras fases.
2. Se algo estiver ambíguo ou faltar uma decisão: **registre a suposição em `docs/DECISIONS.md` e siga com a opção mais simples e reversível.** Se a dúvida afetar segurança, isolamento de tenant ou modelo de dados, **pare e pergunte.**
3. Implemente o mínimo que satisfaz o "Pronto quando". Sem funcionalidades extras, sem refatorações fora do escopo, sem dependências novas sem justificar em `DECISIONS.md`.
4. Rode os comandos de verificação (seção 7) e **cole a saída** no resumo final.
5. Ao terminar, marque a tarefa em `TASKS.md` e escreva um resumo: arquivos criados/alterados, decisões tomadas, o que ficou pendente.
6. Tarefas marcadas com 🛑 exigem **revisão humana antes de seguir**. Pare ao terminar e aguarde.

## 7. Definição de pronto (vale para toda tarefa)

- [ ] `npm run lint` sem erros
- [ ] `npm run typecheck` sem erros
- [ ] `npm test` passando (incluindo os novos testes)
- [ ] `npm run check:raw` passando (a partir da T3.6)
- [ ] Migrations aplicam do zero em um banco limpo, e o seed roda
- [ ] Nenhum `prisma` cru fora dos arquivos permitidos (regra 4.1.2)
- [ ] Toda action nova tem `assertCan`, Zod e `audit`
- [ ] Estados de loading, vazio e erro nas telas novas
- [ ] Critérios "Pronto quando" da tarefa atendidos e demonstrados
- [ ] `TASKS.md` e `docs/DECISIONS.md` atualizados

## 8. Proibido

- Implementar fases futuras "já que está aqui".
- Desligar regra de lint/TypeScript ou usar `// @ts-ignore` para passar.
- Aceitar `organizationId` vindo do cliente.
- Calcular métricas históricas na requisição.
- Apagar dados de produção ou rodar o seed fora de ambiente de desenvolvimento/preview.
- Inventar APIs de bibliotecas. Em caso de dúvida, consulte a documentação.
