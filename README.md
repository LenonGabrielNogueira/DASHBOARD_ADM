# Dashboard ADM — Dashboard Administrativo Organizacional

> Status: base Next.js existente; funcionalidades do Dashboard ADM ainda não implementadas. T0.1 e T0.2 concluídas. Arquitetura aprovada em D-006; preparação de versionamento T0.3 aplicada e aguardando revisão, sem staging ou commits.

## Objetivo

Criar um dashboard administrativo Full Stack simples, responsivo e seguro, usando a mesma família tecnológica do PrismaOfertas. O domínio inicial é **gestão organizacional** (pessoas e departamentos). O painel deve permitir consultar indicadores reais, explorar gráficos e administrar cadastros.

## Escopo da primeira versão (MVP)

- Login com Clerk e acesso restrito a administradores aprovados.
- Layout principal com sidebar, header e estados de carregamento/erro/vazio.
- Dashboard com quatro KPIs: total de colaboradores, colaboradores ativos, total de departamentos, admissões no período.
- Visualizações: admissões mensais (linha/área), pessoas ativas por departamento (barras) e situação ativa/inativa derivada das datas (rosca).
- Filtro de período para indicadores temporais, aplicado também a gráficos correspondentes.
- Cadastro, listagem, edição e desligamento de pessoas; listagem e manutenção de departamentos, com arquivamento condicionado à integridade dos vínculos.
- Página Analytics para detalhar os mesmos indicadores e filtros, sem prometer reconstrução histórica completa.
- Relatórios tabulares com filtros e exportação CSV autorizada.
- Dados de demonstração fictícios, reprodutíveis e documentados.

## Fora do MVP

- Multitenancy completo, provisionamento/sincronização por Clerk Organizations e permissões sofisticadas. O escopo por organização permanece obrigatório no MVP.
- Organograma visual, manutenção avançada de cargos/hierarquias, avaliação de desempenho e indicadores financeiros. `Position` permanece como referência necessária aos vínculos.
- Auditoria funcional, snapshots, relatórios agendados, AWS S3, ImageKit, jobs Inngest, notificações e atualizações em tempo real. Preservar estruturas e pacotes já existentes.
- Recontratação, múltiplos vínculos simultâneos e edição retroativa de vínculos.
- PDFs e Excel, aplicativos móveis nativos e importações em lote.

## Base existente e ferramentas planejadas

T0.1 encontrou Next.js 16.4.3, React 19.3.0, TypeScript 5.9.3, Prisma/Client 6.19.0, Clerk 7.9.20, Tailwind/loader Turbopack 4.3.3, ESLint 9.39.5, shadcn 4.22.1, Base UI 1.9.0 e Recharts 3.10.1. A base contém a página padrão do Next e 16 componentes de UI; Clerk está instalado, mas não integrado. Versões devem ser reconferidas antes de futuras mudanças.

Vitest e Playwright são planejados: os scripts existem, mas os executores não estavam instalados na auditoria. CI ainda é apenas planejamento. Inngest, React Flow e Dagre já instalados permanecem preservados para recursos futuros.

- Next.js App Router + React + TypeScript, reutilizando as versões já instaladas **quando compatíveis**.
- Tailwind CSS, shadcn/ui e Lucide.
- Recharts para gráficos.
- Prisma ORM + Neon PostgreSQL.
- Clerk para identidade; autorização conferida no servidor.
- Vitest para lógica/validações e Playwright para fluxos críticos E2E.
- GitHub Actions para lint, typecheck, testes e build.

### Organização e dados

Preservar provisoriamente `Organization`, `Department`, `Position`, `Person`, `PersonAssignment`, `MetricSnapshot`, `AuditLog` e `ReportSchedule`. `Person` guarda cadastro/admissão/desligamento; `PersonAssignment` relaciona departamento e cargo por vigência. Não substituir por `Employee`.

O MVP opera com uma organização existente, definida em configuração no servidor. Clerk autentica e uma allowlist administrativa autoriza; toda operação verifica o escopo organizacional e as relações. Não haverá seletor ou criação automática de organizações. O provisionamento da organização, inclusive seu `clerkOrgId` obrigatório, será proposto em T4.1.

Os cargos serão selecionados de `Position` da mesma organização, não arquivados. T4.1/T4.3 apresentarão um catálogo mínimo e procedimento de provisionamento separado e aprovado, preferindo reaproveitar registros existentes. Sem catálogo válido, o cadastro informa a pendência e não cria cargo implícito. Nenhum seed é autorizado por este documento.

As definições de contagem única, desligamento, vínculo vigente, datas e limites históricos estão em [DATA_MODEL.md](docs/DATA_MODEL.md). Não interpretar `deletedAt` como desligamento.

## Estrutura e documentação

- [`AGENTS.md`](AGENTS.md): regras obrigatórias para o Codex.
- [`TASKS.md`](TASKS.md): backlog ordenado, critérios de aceitação e portões de aprovação.
- [`CODEX_START.md`](CODEX_START.md): prompt pronto para iniciar a auditoria.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): fluxos, responsabilidades, autenticação e dados.
- [`docs/FILE_TREE.md`](docs/FILE_TREE.md): árvore de arquivos e finalidade de cada item.
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md): modelo vigente, fórmulas e alternativa anterior identificada como histórica.
- [`docs/DECISIONS.md`](docs/DECISIONS.md): registro de decisões, incluindo pontos pendentes.
- [`.env.example`](.env.example): variáveis documentadas com valores vazios, sem credenciais; configuração real somente no ambiente privado.
- [`docs/guia-dashboard-admin.md`](docs/guia-dashboard-admin.md): referência histórica; não é o backlog vigente.

### Evidências e pendências de T0.1

- `npm run lint` e `npm run typecheck -- --incremental false` passaram na auditoria; isso não comprova funcionalidades implementadas.
- `npm test` e `npm run test:e2e` falharam por ausência de Vitest/Playwright. Build não foi executado pela restrição de escrita em `.next`.
- Banco remoto não inspecionado, migrations locais ausentes, cliente Prisma compartilhado ausente e seed ainda sem revisão de segurança e dependência Faker.
- T0.3 corrigiu a pendência do exemplo de ambiente: exceção `!/.env.example` e documentação de `DIRECT_URL`, com valores vazios. Os demais `.env*` continuam protegidos.
- Existem alterações locais e arquivos não rastreados; preservar antes de organizar/versionar.

## Fluxo de trabalho

1. Abrir o repositório existente no VS Code e revisar os arquivos atuais.
2. Mesclar esta documentação **sem sobrescrever decisões e tarefas existentes**.
3. Autorizar somente a tarefa seguinte de `TASKS.md`; T0.1 já foi concluída. `CODEX_START.md` permanece um prompt específico de auditoria.
4. Revisar resultado, testes, diffs e eventuais decisões.
5. Uma tarefa por branch/PR; só avançar após aprovação.

## Preparação do versionamento — T0.3

- Preservar código, estilos, dependências, documentos e os arquivos Prisma/SQL existentes. A preparação não implementa funcionalidades nem resolve as pendências técnicas de T1.1.
- Versionar documentação, configurações, `package.json`/`package-lock.json`, fontes de `src/`, assets de `public/` e `.env.example` após revisão e autorização para staging/commits.
- Manter ignorados dependências, builds, caches, logs, artefatos Playwright e estados autenticados. Somente `.env.example` da raiz é exceção a `.env*`; preencher credenciais apenas em arquivos privados.
- O ZIP `dashboard_adm_planejamento_codex.zip` permanece local, no mesmo caminho, ignorado especificamente; documentos conciliados são a referência versionável.
- Os arquivos `prisma/schema.prisma`, `prisma/seed.ts` e `prisma/manual/assignment_no_overlap.sql` já estão rastreados. Preservar seu conteúdo; versionamento não autoriza migrations, seed ou aplicação do SQL.
- No diagnóstico T0.3, a branch era `feat/T1.1-setup`, sem remoto/upstream. Ela e `master` possuem commits raiz distintos, sem ancestral comum, com árvores idênticas. Nenhuma branch ou configuração foi alterada; uma futura integração exige decisão própria.
- Grupos sugeridos para commits futuros: (1) documentação conciliada e status; (2) `.gitignore` e exemplo de ambiente; (3) base Next.js existente com configurações, package/lockfile, fontes e assets. Isso registra o estado atual, sem declarar T1.1 concluída.
- Antes dos commits autorizados, revisar a lista exata de arquivos, credenciais/artefatos, `git diff --check` e regras de `git check-ignore`; após autorização específica para staging, revisar também o diff preparado. Não normalizar finais de linha globalmente nem descartar alterações locais.
- T0.3 permanece aguardando revisão dos quatro arquivos de preparação. Criar/alternar branches, staging, commits, push e T1.1 não estão autorizados neste ciclo.

## Definição de pronto (MVP)

- Dados de dashboard vêm do PostgreSQL, sem KPIs hardcoded.
- Métricas batem com consultas e testes; datas usam períodos consistentes.
- Login e autorização protegem páginas, ações, exportação e dados.
- Telas funcionam em desktop/mobile e tratam erro, vazio e loading.
- `lint`, `typecheck`, `test` e `build` passam; E2E cobre login/proteção e fluxo principal.
- `.env`/segredos não entram no Git; documentação e exemplos atualizados.

## Referências oficiais

- Next.js App Router: https://nextjs.org/docs/app
- Next.js Proxy: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- Clerk Auth: https://clerk.com/docs/reference/nextjs/app-router/auth
- Prisma + Next.js: https://www.prisma.io/docs/guides/frameworks/nextjs
- Charts shadcn: https://ui.shadcn.com/docs/components/radix/chart
- Vitest/Next.js: https://nextjs.org/docs/app/guides/testing/vitest
