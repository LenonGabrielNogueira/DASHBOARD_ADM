# Dashboard ADM — Dashboard Administrativo Organizacional

> Status: base Next.js existente; funcionalidades do Dashboard ADM ainda não implementadas. T0.1 a T0.4 e T1.1 concluídas e aprovadas pelo usuário. Arquitetura em D-006; T1.2 concluída localmente após revisão e validação em T1.2.1. Infraestrutura registrada no commit `e631a49`; execução remota da CI pendente, sem push.

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

T0.1 encontrou Next.js 16.4.3, React 19.3.0, TypeScript 5.9.3, Prisma/Client 6.19.0, Clerk 7.9.20, Tailwind/loader Turbopack 4.3.3, ESLint 9.39.5, shadcn 4.22.1, Base UI 1.9.0 e Recharts 3.10.1. A base contém a página padrão do Next e 15 componentes de UI (contagem corrigida na auditoria T1.1); Clerk está instalado, mas não integrado. Versões devem ser reconferidas antes de futuras mudanças.

Vitest e Playwright estavam ausentes em T0.1/T1.1 e foram instalados em T1.2, junto à React Testing Library e jsdom. O workflow CI foi criado e revisado localmente; aguarda execução remota. Os resultados locais estão documentados abaixo. Inngest, React Flow e Dagre permanecem preservados para recursos futuros.

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
- T0.1 encontrou alterações locais e arquivos não rastreados; T0.4 registrou a base existente em três commits sem modificar seu conteúdo.

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
- Grupos registrados e aprovados em T0.4: `ae8d97a` — documentação conciliada; `6eea10b` — `.gitignore` e exemplo de ambiente; `ab82586` — base Next.js existente com configurações, package/lockfile, fontes de código e assets. Naquela etapa T1.1 ainda não estava concluída.
- Antes dos commits autorizados, revisar a lista exata de arquivos, credenciais/artefatos, `git diff --check` e regras de `git check-ignore`; após autorização específica para staging, revisar também o diff preparado. Não normalizar finais de linha globalmente nem descartar alterações locais.
- T0.3 e T0.4 foram revisadas e aprovadas. A preparação não criou branches; o registro posterior em T0.4 usou a branch existente. Nenhum push foi executado.

## Fundação técnica concluída — T1.1 / T1.1.1 / T1.1.2

- `npm run lint`, `npm run typecheck`, `npm run build` e `git diff --check` aprovados; o build foi validado com telemetria desativada e HTTP/HTTPS direcionados a proxy local indisponível.
- Geist e Geist Mono são carregadas por `next/font/local`, usando os WOFF2 variáveis de `src/app/fonts/geist/`, pesos 100–900 e `display: swap`. Preservadas `--font-geist-sans`/`--font-geist-mono`; corrigido somente o mapeamento `--font-sans` para Geist Sans.
- Fontes oficiais da Vercel, distribuição 1.4.2, commit `4d655731f83507f0258ce5541c297b6553d5d081`. [Procedência e hashes](src/app/fonts/geist/README.md), [OFL](src/app/fonts/geist/OFL.txt) e [licença original](src/app/fonts/geist/LICENSE.txt) acompanham os arquivos sem alterações. O build não baixa fontes do Google.
- T1.1.2 registra fontes e documentação em dois commits separados, na branch existente, sem alterar dependências, autenticação, banco ou funcionalidades de negócio.
- O encerramento de T1.1 foi aprovado pelo usuário com testes automatizados e cobertura complementar de tipos explicitamente pendentes. Não interpretar os passes de lint/typecheck/build como aprovação de testes ou do MVP completo.

### Pendências identificadas no encerramento de T1.1 — histórico

- Configuração de Vitest, testes efetivos e funcionamento de `npm test`.
- Proposta de preparação do Playwright; fluxos autenticados/E2E permanecem planejados em T8.1.
- Cobertura complementar de tipos para configurações e scripts fora do `include` atual, incluindo `next.config.ts` e `prisma/seed.ts`, sem executar seed.
- Aprovação específica antes de instalar ferramentas ausentes. A dependência Faker e a segurança do seed continuam sujeitas à revisão em T4.3; não mascarar erros com scripts que apenas retornam sucesso. A limitação de `check:raw` segue diagnosticada, sem alteração nesta tarefa.

## Testes e integração contínua — T1.2 concluída localmente

Dependências de desenvolvimento fixadas: Vitest 4.1.12, Vite 7.3.7, plugin React 5.2.0, React Testing Library 16.3.3, DOM Testing Library 10.4.2, jest-dom 7.0.1, jsdom 27.4.0 e Playwright 1.58.2. As versões diretas de produção foram preservadas. A linha Vitest 4 mantém compatibilidade com os tipos Node existentes; a CI usa Node 24, também compatível com `cn` e jsdom. Playwright usa Chromium 1208.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

- `npm test` executa quatro testes reais: composição/precedência de classes de `cn` e interação/estado desabilitado do `Button`. O Vitest usa jsdom, transformação JSX, alias `@` e limpeza do DOM entre testes; E2E não entra na descoberta de testes unitários. Não usar essa suíte para Server Components assíncronos.
- `npm run typecheck` verifica a aplicação e chama `typecheck:tooling`, que inclui `next.config.ts`, configurações de testes, setup e suítes fora de `src/`, via `tsconfig.tooling.json`. O seed permanece explicitamente fora: Faker e cliente Prisma gerado estão ausentes. Não foram criados stubs para esconder esse diagnóstico, nem executados seed/geração/migrations.
- E2E exige build prévio. `playwright.config.ts` inicia e encerra o servidor de produção em `127.0.0.1:3100`, sem reutilizar outro servidor. Dois cenários cobrem a página pública e o retorno após um 404; links externos não são seguidos e requisições HTTP/HTTPS fora da origem local são bloqueadas. Nenhuma credencial Clerk, conexão de banco ou serviço externo é necessário aos testes.
- Se o Chromium compatível não estiver disponível, instalar separadamente com `npx playwright install chromium` após autorização do ambiente. Não foi necessário baixar navegadores nesta execução local. Relatórios, traces, screenshots e estados autenticados continuam ignorados pelo Git.
- `.github/workflows/ci.yml` executa instalação por `npm ci`, lint, typecheck, unitários e build no job `quality`. O job separado `e2e` instala Chromium/dependências de sistema, constrói a aplicação e executa os dois cenários. Permissão somente de leitura do conteúdo, sem secrets. A geração automática do Prisma no postinstall é desativada por variável do processo.
- Validação local: lint, typecheck (aplicação e tooling), quatro testes Vitest e build sem rede aprovados. Dois cenários E2E passaram; no sandbox Windows, o encerramento do servidor temporário precisou de permissão adicional. `npm ci --dry-run --ignore-scripts --no-audit --no-fund` confirmou a consistência do lockfile, sem substituir uma execução limpa da CI Linux.
- Permanecem avisos de peers na árvore OpenTelemetry existente e aviso de API depreciada do Playwright no Node 26 local; não foram feitas correções laterais nessas dependências. O npm ajustou `@types/estree` de 1.0.9 para 1.0.10 ao resolver a infraestrutura. A CI remota, fluxos autenticados de T8.1 e revisão do seed de T4.3 permanecem pendentes. T2 não foi iniciada.

T1.2.1 confirmou a branch `feat/T1.1-setup` a partir de `680ca3a`, preservação das dependências diretas de produção e proteção de ambientes/artefatos. Lint, typecheck, quatro testes Vitest (incluindo repetição), build e dois testes Chromium passaram novamente; `git diff --check` e a checagem do índice passaram. O setup existente permanece em `tests/setup.ts`, referenciado pelo Vitest. A cobertura é inicial e pública: não inclui seed Prisma, fluxos autenticados nem aprovação de execução no GitHub Actions.

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
