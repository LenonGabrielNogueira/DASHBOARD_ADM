# AGENTS.md — Regras do Codex | Dashboard ADM

## Missão

Implementar incrementalmente um dashboard administrativo organizacional (pessoas, departamentos, indicadores e relatórios), reutilizando a stack atual do repositório. Priorizar simplicidade, integridade de dados, segurança e uma interface responsiva.

## Contexto obrigatório antes de trabalhar

Leia, nesta ordem:
1. `AGENTS.md`
2. `README.md`
3. `TASKS.md`
4. `docs/ARCHITECTURE.md`
5. `docs/FILE_TREE.md`
6. `docs/DATA_MODEL.md`
7. `docs/DECISIONS.md`
8. `package.json`, `prisma/schema.prisma` (se existir), `src/app`, configurações atuais e mudanças de Git.

Não presuma que este pacote corresponde ao estado real do repositório: a árvore de arquivos descreve o **estado-alvo**, não necessariamente o presente.

## Regras inegociáveis

- **Referência vigente:** D-006 aprovada em `docs/DECISIONS.md`, detalhada em `docs/ARCHITECTURE.md` e `docs/DATA_MODEL.md`. O guia original é histórico e não autoriza tarefas. Em caso de nova divergência, registre-a antes de implementar.
- Preservar provisoriamente os oito modelos Prisma existentes. O domínio de pessoas usa `Person` e `PersonAssignment`; não criar `Employee` ou `EmploymentStatus` por exemplos antigos.
- MVP: Dashboard, Analytics, Pessoas, Departamentos e Relatórios. Preservar estruturas e dependências de recursos futuros sem ativá-los automaticamente.
- Operar com uma organização definida e validada no servidor. Autenticar, autorizar administrador e limitar consultas, mutações, relações e exportações por `organizationId`; organização única não dispensa isolamento.
- Indicadores contam pessoas únicas, respeitam desligamentos e vigências e seguem o contrato de `docs/DATA_MODEL.md`. Não contar vínculos como pessoas nem apresentar histórico reconstruído como auditoria completa.

- **Inspecione primeiro.** Mostre os arquivos envolvidos, a situação de Git, os scripts e um plano curto antes de editar.
- **Execute somente a tarefa explicitamente autorizada de `TASKS.md`.** Não avance automaticamente para a próxima.
- **Não altere `prisma/schema.prisma`, migrações, seed ou dados existentes sem aprovação explícita.** Apresente proposta, impacto e plano de rollback; registre em `docs/DECISIONS.md`.
- **Não altere `globals.css`, configurações do Tailwind, tokens ou classes existentes sem solicitação.** Proponha diffs antes de mudanças visuais amplas.
- Não substitua as versões atuais de Next.js, React, Prisma, Clerk, Tailwind ou outras bibliotecas sem justificativa e aprovação.
- Não remova nem sobrescreva arquivos existentes para adequar o projeto à árvore de planejamento. Integre com a estrutura real.
- Nunca leia, imprima, registre no log ou comite segredos/valores de `.env` ou `.env.local`. Use apenas nomes de variáveis.
- Dados privados e operações mutáveis: autenticação **e autorização no servidor**, mesmo quando as rotas são protegidas pelo Proxy.
- Não confie em filtros/client-side, botões escondidos, `userId` enviado pelo cliente ou apenas `proxy.ts` como controle de acesso.
- Não crie métricas falsas apresentadas como dados reais. Use consultas confiáveis ou seeds claramente rotuladas como demonstração.
- Uma tarefa = um branch/PR sempre que possível. Sem alterações de escopo ocultas ou refatorações laterais.
- Não adicione pacotes, provedores, filas ou integrações sem necessidade definida e aprovada.

## Padrões técnicos

- Next.js App Router. Server Components para páginas/consulta; Client Components só para interatividade e gráficos.
- TypeScript com tipos explícitos nos contratos importantes; sem `any` desnecessário.
- Centralizar consultas em `src/server/queries`, mutações em `src/server/actions`, validações em `src/lib/validations`.
- Prisma somente no lado servidor. Reaproveite instância/singleton quando existir; a auditoria T0.1 não encontrou cliente compartilhado na aplicação.
- Para ações que alteram dados: validação no servidor, autorização, checagem de relações e atualização coerente de cache/UI.
- Para telas: acessibilidade básica, responsividade, estados de vazio/erro/loading e idioma `pt-BR`.
- Datas de negócio: interpretar filtros em `America/Sao_Paulo`, armazenar datas em instantes UTC quando aplicável, usar intervalo `[início, fim)`; documentar conversões.
- Consultas agregadas devem evitar carregar o catálogo inteiro na aplicação para contar em JavaScript.
- API/CSV devem limitar campos expostos e validar filtros/permissões; escapar células com risco de fórmula ao exportar CSV.
- Na base Next.js 16, usar a convenção `src/proxy.ts` (ou localização apropriada ao projeto) e `await auth()`; verificar versão e configuração antes de implementar.
- `Vitest` cobre funções síncronas de cálculo e validação; Playwright cobre fluxos autenticados com Server Components assíncronos.

## Como responder ao finalizar cada tarefa

Entregar um relatório curto com:
1. **Tarefa e objetivo**.
2. **Diagnóstico** (arquivos encontrados e decisões/restrições).
3. **Alterações** (arquivos criados/editados e por quê).
4. **Testes** (comandos executados, resultados, falhas e limitações).
5. **Diff/impacto** e riscos de compatibilidade.
6. **Próxima tarefa sugerida**, apenas como sugestão; não executá-la.

## Critérios de parada

Interrompa alterações e peça aprovação caso a tarefa exija modificar banco/schema, migrations, auth existente, estilos globais, atualizar dependências principais, remover dados ou reestruturar diretórios além do escopo autorizado. Se testes falharem, reporte a causa observada; não faça mudanças não relacionadas para tentar mascarar a falha.
