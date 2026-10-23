# TASKS.md: Dashboard Administrativo Organizacional

Lista de tarefas para execução com agente (Codex ou similar), **uma tarefa por sessão/branch/PR**.

Legenda: `[ ]` pendente · `[x]` concluída · 🛑 revisão humana obrigatória antes de seguir

---

## Como usar

### Prompt para iniciar uma tarefa

Cole isto no início de cada sessão, trocando o ID:

```
Leia AGENTS.md por completo e depois a tarefa T<ID> em TASKS.md.
Leia também os arquivos que a tarefa manda ler.
Implemente SOMENTE essa tarefa, seguindo as regras do AGENTS.md.
Antes de codar, me diga em 5 linhas o plano e quais arquivos vai criar/alterar.
Ao terminar: rode lint, typecheck e testes, cole a saída, atualize TASKS.md e
docs/DECISIONS.md e liste o que ficou pendente. Não comece outra tarefa.
```

### Regras do fluxo

1. Siga a ordem. Cada tarefa lista suas dependências.
2. Uma tarefa = uma branch (`feat/T5.2-people-actions`) = um PR.
3. Ao fim de cada **fase**, rode o checkpoint da fase antes de abrir a próxima.
4. Tarefas 🛑 não avançam sem sua revisão. Cole o diff para uma segunda opinião sobre isolamento de tenant, permissões e SQL.
5. Sugestão de condução: **Fases 1 a 3 de perto**, com você revisando tudo. A partir da Fase 5, depois que "Pessoas" estiver correta, o agente pode andar mais solto replicando o padrão.

### Visão geral

| Fase | Entrega |
|---|---|
| 1 | Projeto, ferramentas, CI |
| 2 | Banco, schema, seed |
| 3 | Auth e isolamento multi-tenant |
| 4 | Layout (shell) |
| 5 | CRUD: Pessoas, Departamentos, Cargos |
| 6 | Organograma |
| 7 | Métricas e dashboard |
| 8 | Auditoria e permissões |
| 9 | Relatórios e export |
| 10 | Testes E2E, deploy, segurança |

---

# FASE 1: Projeto e ferramentas

### [ ] T1.1: Criar o app e instalar dependências
- **Depende de:** nada
- **Ler:** `docs/guia-dashboard-admin.md` (Fase 1)
- **Fazer:**
  - `create-next-app` (TypeScript, Tailwind, ESLint, App Router, `src/`, alias `@/*`)
  - Instalar as dependências listadas na Fase 1.2 do guia e inicializar o shadcn/ui
  - Criar os scripts do `package.json` listados na seção 3 do `AGENTS.md` (`check:raw` pode apontar para um placeholder até a T3.6)
  - Ligar `strict` no `tsconfig`
- **Pronto quando:** `npm run dev` abre a página inicial; `lint` e `typecheck` passam.
- **Não fazer:** criar telas, schema ou auth.

### [ ] T1.2: Estrutura de pastas, env e README
- **Depende de:** T1.1
- **Fazer:**
  - Criar as pastas base de `src/` conforme `AGENTS.md` §5.1 (com `.gitkeep` onde estiver vazia)
  - Criar `.env.example` (sem valores) com as variáveis da Fase 1.4 do guia
  - Garantir `.env*` no `.gitignore` (exceto `.env.example`)
  - Escrever `README.md` com setup local, scripts e link para `AGENTS.md`/`TASKS.md`
  - Criar `docs/DECISIONS.md` (formato: data · decisão · motivo · alternativas)
- **Pronto quando:** um dev novo consegue seguir o README e rodar o app.

### [ ] T1.3: Vitest e CI
- **Depende de:** T1.1
- **Fazer:**
  - Configurar Vitest (ambiente node; alias `@/*`) e um teste de fumaça
  - GitHub Actions: `lint`, `typecheck`, `test` em PRs; `prisma validate` quando o schema existir
- **Pronto quando:** o workflow roda verde em um PR de teste.

> **Checkpoint Fase 1:** app sobe, CI verde, README claro.

---

# FASE 2: Banco, schema e seed

### [ ] T2.1: Prisma e schema
- **Depende de:** T1.2
- **Ler:** `prisma/schema.prisma`, guia (Fase 2)
- **Fazer:**
  - Inicializar o Prisma e usar o `prisma/schema.prisma` do repositório como está
  - Configurar `DATABASE_URL` (pooler) e `DIRECT_URL` (direta) conforme a versão do Prisma instalada. **Consulte a doc da versão.**
  - `npm run db:migrate -- --name init`
- **Pronto quando:** migration aplica em banco limpo; `prisma validate` passa; `db:studio` mostra as tabelas.
- **Não fazer:** alterar o modelo de dados sem registrar em `DECISIONS.md`.

### [ ] T2.2: Exclusion constraint de assignments
- **Depende de:** T2.1
- **Ler:** `prisma/manual/assignment_no_overlap.sql`
- **Fazer:** criar a migration com `--create-only`, colar o SQL e aplicar.
- **Pronto quando:** existe um teste (Vitest, com banco de teste) que tenta inserir dois assignments sobrepostos para a mesma pessoa e **falha**, e outro com períodos adjacentes (fim = início) que **passa**.

### [ ] T2.3: Cliente Prisma e seed
- **Depende de:** T2.1
- **Ler:** `prisma/seed.ts`
- **Fazer:**
  - Criar `src/lib/db.ts` (singleton do Prisma, seguro para hot reload)
  - Configurar `prisma.seed` no `package.json`; instalar `@faker-js/faker` e `tsx` como dev
  - Rodar o seed
- **Pronto quando:** `npm run db:seed` roda duas vezes seguidas sem erro, gerando ~300 pessoas, e o `db:studio` mostra uma árvore coerente.

### [ ] T2.4: Testes de invariantes do seed
- **Depende de:** T2.3
- **Fazer:** teste de integração que, após o seed, verifica: e-mails únicos; todo gestor existe, não está desligado e foi contratado antes do subordinado; assignments de cada pessoa são contíguos, começam na admissão e terminam no desligamento (ou ficam abertos).
- **Pronto quando:** teste passa e roda no CI (com Postgres de serviço ou branch de teste).

> **Checkpoint Fase 2:** banco do zero até seed funcionando com um único comando documentado.

---

# FASE 3: Auth e multi-tenant

> Fase crítica. Faça de perto.

### [ ] T3.1: Clerk, middleware e páginas de login
- **Depende de:** T1.2
- **Ler:** guia (Fase 3.1); documentação do Clerk da versão instalada
- **Fazer:**
  - `ClerkProvider`, páginas de sign-in/sign-up
  - Middleware (ou `proxy.ts`, conforme a versão do Next) protegendo tudo exceto `/sign-in`, `/sign-up`, `/api/inngest`, `/api/webhooks/*`
  - Ativar e usar Organizations (seleção/criação de organização no fluxo)
- **Pronto quando:** rota protegida redireciona para login; após login e escolha de organização, a página inicial carrega.

### [ ] T3.2: Webhook de sincronização de organização
- **Depende de:** T3.1, T2.1
- **Fazer:** `POST /api/webhooks/clerk` com **verificação de assinatura**, tratando `organization.created/updated/deleted` e criando/atualizando `Organization`.
- **Pronto quando:** teste com payload assinado cria a organização; payload sem assinatura válida retorna 400/401 e não escreve nada.

### [ ] T3.3: `getContext` e base de permissões
- **Depende de:** T3.1, T2.3
- **Fazer:**
  - `src/lib/auth.ts` com `getContext()` retornando `{ userId, organizationId, role }` (resolve `Organization` pelo `clerkOrgId`; lança erro tipado se não autenticado ou sem organização)
  - `src/lib/permissions.ts` com a matriz inicial de papéis → permissões, `can()` e `assertCan()`
- **Pronto quando:** testes unitários cobrem `can/assertCan` para cada papel e o erro de não autenticado.

### [ ] T3.4: 🛑 `tenantDb` + teste de isolamento (escreva o teste PRIMEIRO)
- **Depende de:** T3.3
- **Ler:** guia (Fase 3.4); `AGENTS.md` §4.1
- **Fazer:**
  1. **Primeiro**, escrever a suíte de isolamento: duas organizações com dados; usando `tenantDb(orgA)`, provar que **não é possível** ler (`findMany`, `findFirst`, `count`, `groupBy`), atualizar (`updateMany`) nem apagar (`deleteMany`) dados da `orgB`, e que `create`/`createMany` gravam sempre com o `organizationId` correto, **ignorando** um `organizationId` diferente passado em `data`
  2. Depois implementar `src/lib/tenant.ts` até a suíte passar
  3. Cobrir também operações por chave única (`findUnique`, `update`, `delete`, `upsert`): ou bloquear/redirecionar para o padrão seguro, ou garantir o filtro. **Registre a decisão em `DECISIONS.md`.**
- **Pronto quando:** a suíte cobre todos os modelos de tenant e passa; tentar usar `update`/`delete` por id inseguro falha ou é filtrado por organização.
- **🛑 Revisão humana:** o diff inteiro de `tenant.ts` e da suíte de testes.

### [ ] T3.5: Contexto + `tenantDb` integrados
- **Depende de:** T3.4
- **Fazer:** helper `getDb()` em `src/lib/auth.ts` (ou `tenant.ts`) que chama `getContext()` e devolve `{ ctx, db: tenantDb(ctx.organizationId) }`, para ser o único ponto de entrada de dados nas features.
- **Pronto quando:** um Server Component de exemplo lista departamentos usando `getDb()`; com duas organizações no Clerk, cada uma vê apenas os seus.

### [ ] T3.6: Script `check:raw`
- **Depende de:** T3.4
- **Fazer:** script (`scripts/check-raw-queries.ts`) que varre `src/` procurando `$queryRaw`/`$executeRaw` e falha se o template não contiver `organizationId`. Rodar no CI.
- **Pronto quando:** o script falha em um exemplo propositalmente inseguro e passa no código atual.

> **Checkpoint Fase 3:** com 2 organizações no Clerk, uma não vê, edita nem acessa por URL dados da outra. Suíte de isolamento no CI.

---

# FASE 4: Layout

### [ ] T4.1: Shell (sidebar, topbar, navegação)
- **Depende de:** T3.5
- **Ler:** guia (Fase 4)
- **Fazer:** `(dashboard)/layout.tsx` com Sidebar fixa (desktop) e `Sheet` (mobile); Topbar com `OrganizationSwitcher` e `UserButton`; links para todas as seções (páginas podem ser placeholders). Itens do menu escondidos por papel (conveniência; a segurança real está no servidor).
- **Pronto quando:** navegação completa e responsiva entre páginas placeholder.

### [ ] T4.2: Estados padrão
- **Depende de:** T4.1
- **Fazer:** `loading.tsx`, `error.tsx`, `not-found.tsx` nas rotas principais; componente de breadcrumbs; componente `EmptyState` reutilizável.
- **Pronto quando:** cada rota tem os três estados verificáveis.

---

# FASE 5: CRUD (Pessoas, Departamentos, Cargos)

> "Pessoas" é o **modelo** das demais. Faça com capricho; depois replique.

### [ ] T5.1: Pessoas, listagem
- **Depende de:** T4.2
- **Fazer:**
  - `features/people/queries.ts`: listagem **server-side** com paginação, ordenação, busca (nome/e-mail), filtros por departamento e status (ativo/desligado), via query string (`nuqs`)
  - Tabela com TanStack Table: avatar/iniciais, nome, cargo atual, departamento atual, gestor, admissão, status
  - Cargo e departamento atuais vêm do assignment vigente
- **Pronto quando:** com o seed, filtrar/ordenar/paginar funciona e é refletido na URL; teste de isolamento da query.

### [ ] T5.2: 🛑 Pessoas, actions e regras de negócio
- **Depende de:** T5.1, T3.4
- **Ler:** `AGENTS.md` §4.2 e §4.3
- **Fazer:** `features/people/schemas.ts` e `actions.ts` com criar, editar, transferir/promover, desligar e remover (soft delete). Regras:
  - Sem ciclos na hierarquia (função própria, com testes)
  - Gestor precisa existir e estar ativo
  - Promoção/transferência fecha o assignment vigente e abre outro **na mesma transação**; sem lacunas nem sobreposição
  - Desligamento exige novo gestor para os subordinados diretos; fecha assignment e preenche `terminatedAt`
  - Todas seguem a ordem do `AGENTS.md` §4.2 (contexto → permissão → Zod → regra → escrita → auditoria → revalidate)
- **Pronto quando:** testes cobrem: ciclo direto e indireto rejeitados; promoção gera dois períodos contíguos; desligamento sem novo gestor é rejeitado; usuário `member` não consegue escrever; org B não consegue alterar pessoa da org A (inclusive por id manipulado).
- **🛑 Revisão humana:** `actions.ts`, função de ciclo e testes.

### [ ] T5.3: Pessoas, formulários e telas
- **Depende de:** T5.2
- **Fazer:** páginas `new`, `[id]` (detalhe + histórico de cargos) e edição, com React Hook Form + `zodResolver` usando o **mesmo** schema das actions; comboboxes com busca para departamento, cargo e gestor (gestor exclui a própria pessoa e seus subordinados); feedback com toasts; estados de erro de validação por campo.
- **Pronto quando:** fluxo completo criar → editar → promover → desligar funciona pela interface e o histórico aparece no detalhe.

### [ ] T5.4: Departamentos (CRUD com árvore)
- **Depende de:** T5.3
- **Fazer:** mesmo padrão de Pessoas; `parentId` com validação de ciclo; impedir remover departamento com pessoas ativas ou subdepartamentos ativos.
- **Pronto quando:** testes das regras e de isolamento passam.

### [ ] T5.5: Cargos (CRUD)
- **Depende de:** T5.3
- **Fazer:** mesmo padrão; impedir remover cargo em uso por assignment vigente.
- **Pronto quando:** testes das regras e de isolamento passam.

### [ ] T5.6: Export CSV de pessoas
- **Depende de:** T5.1
- **Fazer:** rota `api/export/people` que respeita **os mesmos filtros** da listagem e a permissão do usuário; resposta em streaming; escapar campos (proteção contra injeção de fórmula em planilhas).
- **Pronto quando:** CSV abre corretamente no Excel/Sheets com acentos; usuário sem permissão recebe 403.

> **Checkpoint Fase 5:** criar, editar, promover, transferir e desligar uma pessoa; conferir no `db:studio` que o histórico está correto.

---

# FASE 6: Organograma

### [ ] T6.1: Dados e construção do grafo
- **Depende de:** T5.2
- **Ler:** guia (Fase 6)
- **Fazer:**
  - Query da árvore completa (pessoas ativas, com cargo/departamento atuais)
  - Query recursiva da subárvore de um gestor (`WITH RECURSIVE`, com `organizationId` em todos os ramos e proteção contra ciclo/profundidade)
  - `build-tree.ts` convertendo em nós e arestas
- **Pronto quando:** testes unitários cobrem raiz única, múltiplos níveis, pessoa sem gestor e subárvore; teste de isolamento da query raw; `check:raw` passa.

### [ ] T6.2: Layout automático e componente
- **Depende de:** T6.1
- **Fazer:** `layout.ts` com dagre (`rankdir: TB`, tamanho fixo de nó, espaçamentos generosos); componente com React Flow, `PersonNode` (avatar, nome, cargo, nº de subordinados) memoizado, `Controls`, `MiniMap`, `Background`; `nodesDraggable={false}`.
- **Pronto quando:** organograma do seed renderiza sem sobreposição de nós.

### [ ] T6.3: Interação: colapsar, buscar, detalhes
- **Depende de:** T6.2
- **Fazer:** colapsar/expandir por gestor (padrão: colapsado a partir do nível 2 ou 3); busca por nome que centraliza e destaca o nó; filtro por departamento; clique abre `Sheet` com detalhes; opção "ver só o meu time" usando a subárvore.
- **Pronto quando:** todas as interações funcionam e o layout só é recalculado quando os nós visíveis mudam.

### [ ] T6.4: Volume e desempenho
- **Depende de:** T6.3
- **Fazer:** rodar com `SEED_PEOPLE=1000`; medir tempo de carga e renderização; ajustar (colapso forçado acima de um limite de nós visíveis, carga de filhos sob demanda se preciso). Registrar números em `DECISIONS.md`.
- **Pronto quando:** abre em tempo aceitável (alvo: abaixo de ~2 s para a visão inicial) e navegar não trava.

> **Checkpoint Fase 6:** organograma com 300+ pessoas abre rápido, colapsa/expande e a busca funciona.

---

# FASE 7: Métricas e dashboard

### [ ] T7.1: Catálogo de métricas
- **Depende de:** T5.2
- **Fazer:** `features/metrics/definitions.ts` com cada métrica (`key`, nome, **definição exata em texto**, unidade, dimensões): `headcount`, `hires`, `terminations`, `turnover_30d`. Documentar as definições também em `docs/METRICS.md`.
- **Pronto quando:** cada métrica tem definição sem ambiguidade (ex.: como tratar quem entra e sai no mesmo dia).

### [ ] T7.2: 🛑 `computeSnapshots` e backfill
- **Depende de:** T7.1
- **Fazer:**
  - `features/metrics/snapshots.ts`: calcula, para uma organização e uma data, as métricas globais e por departamento (`dimension = "dept:<id>"`), gravando com `upsert` na chave única (idempotente)
  - Função de **backfill** para um intervalo de datas
  - Queries SQL com `organizationId` explícito
- **Pronto quando:** testes com dados conhecidos conferem os números contra uma contagem independente em **pelo menos 3 datas** (incluindo dia de admissão, de desligamento e de promoção); rodar duas vezes não duplica nem altera valores; backfill do seed (~6 anos) termina em tempo razoável.
- **🛑 Revisão humana:** SQL e testes de conferência numérica.

### [ ] T7.3: Job do Inngest
- **Depende de:** T7.2
- **Ler:** documentação do Inngest da versão instalada (sintaxe de cron e `serve`)
- **Fazer:** `src/inngest/client.ts`, função `daily-snapshot` (cron diário; um `step` por organização) e `src/app/api/inngest/route.ts`.
- **Pronto quando:** a função aparece no Inngest Dev Server e executa o snapshot do dia para todas as organizações.

### [ ] T7.4: Queries de leitura
- **Depende de:** T7.2
- **Fazer:** `getKpis(period)` (valor atual, valor no período anterior, variação %), `getSeries(key, from, to, dimension)`. Só leem `MetricSnapshot`.
- **Pronto quando:** testes de borda (período sem dados, período anterior inexistente, divisão por zero) passam; teste de isolamento.

### [ ] T7.5: Componentes do dashboard
- **Depende de:** T7.4
- **Fazer:** `KpiCard` (valor, variação com seta, sparkline), gráfico de linha (headcount), barras (headcount por departamento), barras/combo (admissões vs desligamentos por mês), seletor de período (7d, 30d, 90d, 12m, personalizado) guardado na URL; estados de loading, vazio e erro.
- **Pronto quando:** componentes funcionam com dados reais do snapshot; eixos com unidade e títulos claros.

### [ ] T7.6: Página inicial
- **Depende de:** T7.5, T8.1 (para "atividade recente"; pode usar placeholder até lá)
- **Fazer:** 4 KPIs no topo, 2 gráficos grandes e tabela de atividade recente.
- **Pronto quando:** os números da tela batem com consultas manuais no banco para 3 datas diferentes.

> **Checkpoint Fase 7:** números do dashboard conferidos manualmente; job rodando; backfill documentado no README.

---

# FASE 8: Auditoria e permissões

### [ ] T8.1: Auditoria
- **Depende de:** T5.2
- **Fazer:** `src/lib/audit.ts` (apenas `create`; nunca grava dados sensíveis em `before`/`after`); aplicar em **todas** as actions de escrita existentes; página `audit-log` com filtros por entidade, ator e período, paginada no servidor.
- **Pronto quando:** teste percorre todas as actions de escrita e confirma que cada uma gera um registro; não existe caminho de código que atualize ou apague `AuditLog`.

### [ ] T8.2: 🛑 Matriz completa de permissões
- **Depende de:** T8.1
- **Fazer:** completar `permissions.ts` (papéis `admin`, `manager`, `member`) e garantir `assertCan` em **toda** action e rota de API; teste que enumera as actions/rotas e falha se alguma não chamar `assertCan`.
- **Pronto quando:** testes por papel × ação passam; chamar uma action de escrita como `member` retorna erro mesmo burlando a interface.
- **🛑 Revisão humana:** matriz e teste de cobertura.

### [ ] T8.3: Gestor edita apenas sua subárvore
- **Depende de:** T8.2, T6.1
- **Fazer:** permissão `people:write:team`, aplicada reutilizando a query recursiva (a pessoa-alvo precisa estar na subárvore do gestor).
- **Pronto quando:** gestor edita subordinado direto e indireto; é bloqueado para pessoa fora da sua subárvore; teste de isolamento mantido.

---

# FASE 9: Relatórios e export

### [ ] T9.1: Exports adicionais
- **Depende de:** T5.6, T8.2
- **Fazer:** exports de departamentos e de métricas (CSV), com permissão e streaming.
- **Pronto quando:** testes de permissão e de conteúdo passam.

### [ ] T9.2: Relatórios agendados
- **Depende de:** T7.3, T8.2
- **Fazer:** tela de `reports` (CRUD de `ReportSchedule`: nome, tipo, frequência, destinatários, ativo); função Inngest que monta o resumo (KPIs + variação) e envia por e-mail (provedor a decidir e registrar em `DECISIONS.md`); atualiza `lastRunAt`.
- **Pronto quando:** disparo manual envia um e-mail com os números corretos; agendamento desativado não envia.

---

# FASE 10: Qualidade, deploy e segurança

### [ ] T10.1: Testes E2E
- **Depende de:** Fases 5 a 8
- **Fazer:** Playwright com 3 fluxos: login e seleção de organização; criar e promover pessoa; abrir organograma e buscar uma pessoa.
- **Pronto quando:** passam localmente e no CI.

### [ ] T10.2: Deploy
- **Depende de:** T10.1
- **Fazer:** projeto na Vercel com variáveis de produção e preview; `prisma generate` no build; `prisma migrate deploy` em etapa de CI/CD (não no build); registrar o app no Inngest (`/api/inngest`); URL do webhook do Clerk de produção; (opcional) integração Neon + Vercel com branch de banco por preview.
- **Pronto quando:** ambiente de produção funcional de ponta a ponta com uma organização de teste.

### [ ] T10.3: Segurança e observabilidade
- **Depende de:** T10.2
- **Fazer:** Sentry (ou equivalente) em actions e jobs; logs estruturados sem dados pessoais; headers de segurança; rate limit nas rotas de export; revisar toda `$queryRaw`; confirmar janela de restauração (PITR) do plano do Neon.
- **Pronto quando:** erro provocado de propósito aparece no monitoramento; `check:raw` passa; checklist de lançamento abaixo concluído.

---

## Checklist de lançamento

- [ ] Isolamento entre organizações testado automaticamente (CI)
- [ ] Todas as actions têm `assertCan`, Zod e auditoria (testes de cobertura)
- [ ] Organograma testado com volume realista
- [ ] Números do dashboard conferidos contra consultas manuais
- [ ] Jobs idempotentes; backfill documentado
- [ ] Variáveis de ambiente e webhooks de produção configurados
- [ ] Loading, vazio e erro em todas as telas
- [ ] Responsivo (mobile) nas telas principais
- [ ] README atualizado; `DECISIONS.md` completo

---

## Backlog pós-MVP (só com demanda real)

- Comparação período vs. período anterior em todos os gráficos
- Metas/OKRs ligados a times
- Dashboards com widgets customizáveis
- Módulos: ausências/férias, avaliações, ativos
- Integrações (Slack, Google Workspace)
- Edição do organograma por arrastar e soltar (com confirmação e auditoria)
- Campos customizáveis em pessoas via `JSONB` + Zod
