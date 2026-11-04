# DECISIONS.md — Registro de decisões

> Registro cumulativo. D-006 é a decisão de arquitetura vigente, aprovada pelo usuário em 2026-11-04. As propostas anteriores permanecem abaixo com sua situação atual identificada. Aprovação documental não autoriza implementar tarefas posteriores.

## D-001 — Escopo MVP enxuto

- **Situação vigente (2026-11-04):** substituída pela consolidação D-006. Mantidos os cinco módulos e escopo enxuto; estruturas e dependências avançadas já existentes são preservadas, mesmo fora do produto MVP. Texto original abaixo.

- **Status:** Proposta de planejamento, sujeita à revisão durante T0.1/T0.2.
- **Decisão proposta:** iniciar com dashboard organizacional de pessoas/departamentos, 4 KPIs, 3 famílias de gráficos, CRUD, relatórios CSV, login administrativo.
- **Justificativa:** demonstrar Full Stack e indicadores com dados reais sem complexidade de multitenancy/organograma na primeira entrega.
- **Consequência:** não incluir AWS S3, ImageKit, Inngest, Clerk Organizations ou organograma no MVP.

## D-002 — Preservar a stack existente

- **Situação vigente (2026-11-04):** ratificada por D-006; sem upgrades, instalação ou remoção automática de pacotes. Abaixo permanece o registro da proposta original.

- **Status:** Proposta.
- **Decisão proposta:** reaproveitar Next.js, React, TypeScript, Tailwind, Prisma, Clerk e UI já presentes em `BASE-DASH-001`; sem upgrades automáticos.
- **Justificativa:** minimizar riscos de regressão e acelerar entrega.
- **Condição:** inspecionar arquivos/versões reais antes de executar.

## D-003 — Modelos de dados `Department`/`Employee`

- **Situação vigente (2026-11-04):** proposta substituída por D-006, sem autorização para criar `Employee`/`EmploymentStatus` ou substituir o schema. A alternativa original está preservada na seção histórica de `DATA_MODEL.md`. O status pendente abaixo pertence à proposta anterior, não constitui uma autorização atual.

- **Status:** **PENDENTE DE APROVAÇÃO EXPLÍCITA**.
- **Proposta:** modelo e regras em `DATA_MODEL.md`.
- **Não autorizado:** editar schema, executar migrações ou seed, criar/limpar banco.
- **Para decidir:** conflito com entidades existentes, migração e rollback, política de exclusão, ambiente de teste e versão Prisma.

## D-004 — Administração e acesso

- **Situação vigente (2026-11-04):** substituída pela consolidação D-006, que mantém Clerk/allowlist e acrescenta contexto confiável da organização única e validação de escopo/relações no servidor. Texto original abaixo.

- **Status:** Proposta.
- **Decisão proposta:** usar Clerk com allowlist de IDs admin em configuração server-side no MVP, sem acesso aberto por apenas login.
- **Condição:** validar a implementação auth atual antes de tocar em Clerk/Proxy; checar autorização em cada recurso sensível.

## D-005 — Datas e métricas

- **Situação vigente (2026-11-04):** substituída pela consolidação D-006. Preservados fuso e intervalos; acrescidas regras de contagem única, situação derivada, vigência, distribuição apenas de ativos e limites históricos. Texto original abaixo.

- **Status:** Proposta.
- **Decisão proposta:** `America/Sao_Paulo`, intervalos `[start, end)`, valores atuais separados dos indicadores por período, e dados demonstrativos rotulados.
- **Condição:** validar cálculos com testes.

## D-006 — MVP simplificado sobre o modelo existente

- **Data:** 2026-11-04.
- **Status:** **APROVADA** pelo usuário na autorização de execução de T0.2 nesta conversa.
- **Contexto:** T0.1 encontrou base Next.js, oito modelos Prisma e guia anterior com escopo SaaS mais amplo. O novo planejamento propunha `Employee`, divergindo do schema real. O banco remoto não foi inspecionado e existem alterações locais anteriores a preservar.
- **Decisão:** preservar provisoriamente `Organization`, `Department`, `Position`, `Person`, `PersonAssignment`, `MetricSnapshot`, `AuditLog` e `ReportSchedule`. Adotar `Person`/`PersonAssignment` como referências do domínio de pessoas. Entregar Dashboard, Analytics, Pessoas, Departamentos e Relatórios.
- **Operação e segurança:** uma organização operacional existente definida por configuração confiável no servidor, com validação de existência; nenhuma escolha automática ou `organizationId` confiado ao cliente. Clerk autentica, allowlist administrativa autoriza e todas as leituras, escritas, relações e exportações verificam o escopo. Não habilitar seletor, webhooks ou provisionamento de Clerk Organizations no MVP. Preservar `clerkOrgId` e planejar seu provisionamento em T4.1.
- **Dados e indicadores:** regras normativas em `DATA_MODEL.md`: contagem única por `Person.id`, exclusão de arquivados das métricas operacionais, um instante de referência, situação derivada de admissão/desligamento, intervalos semiabertos e meses em `America/Sao_Paulo`. Distribuição por departamento conta ativos com único vínculo vigente, incluindo categoria explícita de inconsistências. Preservar histórico de vínculos sem prometer histórico completo auditável. Analytics e relatórios compartilham essas definições.
- **Cargos e organização:** `Position` permanece catálogo necessário aos vínculos, sem módulo avançado. T4.1/T4.3 deverão propor reaproveitamento de registros válidos e provisionamento mínimo idempotente, sem reset, com autorização separada para qualquer operação. Sem catálogo válido, bloquear cadastro e informar a pendência. Não executar o seed existente.
- **Recursos futuros:** multitenancy completo, organograma, manutenção avançada de cargos/hierarquias, auditoria funcional, snapshots, relatórios agendados, jobs, recontratação, vínculos simultâneos e correções retroativas. Preservar os modelos, arquivos, dados e pacotes associados.
- **Organização do código:** manter App Router; planejar consultas em `src/server/queries`, mutações em `src/server/actions`, validações em `src/lib/validations` e apresentação em `src/components`. O guia baseado em `src/features` passa a referência histórica, sem reestruturação automática.
- **Decisões anteriores:** substitui D-001, D-003, D-004 e D-005 como referência vigente, mantendo seus textos históricos; ratifica D-002. A antiga proposta `Employee` não deve orientar implementação.
- **Alternativas consideradas:** substituir o schema pela proposta simplificada (descartada neste ciclo pelo risco e desnecessidade); implementar integralmente o SaaS do guia original (adiado pelo escopo); preservar modelos e simplificar os fluxos expostos (adotada).
- **Impacto:** nenhuma mudança de runtime, banco ou dependências nesta tarefa. A preservação dos modelos mantém obrigações de organização, catálogo de cargos, integridade de relações, vigência e concorrência, a validar antes da implementação.
- **Limites da autorização:** somente os oito documentos autorizados em T0.2; sem código, schema, seed, migrations, operações remotas, dependências, estilos, commits ou configuração Git. T0.3 não iniciada. A conclusão da revisão documental será registrada no backlog após aceite.
- **Rollback documental:** reverter apenas os trechos desta conciliação, comparados ao conteúdo local anterior, sem `reset`/restauração integral contra HEAD e sem apagar trabalho prévio. Qualquer futura alteração de dados exigirá plano de rollback próprio; esta decisão não executa migração.
- **Pendências:** organização operacional e seu `clerkOrgId`, catálogo inicial de cargos, revisão do seed e SQL manual, garantias de concorrência, ferramentas de teste, CI, cliente Prisma e organização/versionamento da base.

## Pendências históricas anteriores à conciliação

O histórico anterior do repositório também registrava a escolha entre uso interno e SaaS multi-cliente e a definição de provedor de email para relatórios agendados. D-006 resolve o primeiro ponto para o MVP como operação de uma organização; o segundo continua adiado junto aos agendamentos, sem seleção de provedor.

## D-007 — Infraestrutura de testes e CI sem serviços de negócio

- **Status:** implementada para revisão; instalação e CI autorizadas expressamente pelo usuário no escopo ampliado de T1.2. Não constitui aprovação do diff final nem início de T2.
- **Contexto:** scripts Vitest/Playwright existiam sem executores; typecheck não incluía configurações ou testes externos a `src/`; CI era apenas planejamento em T1.3.
- **Decisão:** Vitest 4.1.12 + Vite 7.3.7/plugin React 5.2.0, RTL 16.3.3/DOM 10.4.2/jest-dom 7.0.1 e jsdom 27.4.0 para testes unitários/componentes síncronos. Playwright 1.58.2 usa o Chromium 1208 já disponível; Server Components assíncronos e fluxos autenticados permanecem no E2E de fases próprias. Nenhum componente de produção é alterado para criar testes.
- **Tipos:** manter tsconfig da aplicação e adicionar `tsconfig.tooling.json` para configurações e suítes. O script principal executa ambas as checagens. Seed com dependências incompletas é exclusão explícita e documentada, sem stubs, execução ou geração Prisma. Sua validação integral fica pendente para T4; não declarar cobertura completa do repositório.
- **CI:** workflow entregue junto de T1.2, conciliando a tarefa T1.3 existente. Node 24; jobs separados quality e E2E, instalação reproduzível pelo lockfile, privilégios de leitura e sem credenciais. `PRISMA_SKIP_POSTINSTALL_GENERATE` evita geração automática; não há migrations/seed. Testes de browser usam somente servidor local de produção e bloqueiam requisições externas.
- **Impacto:** somente infraestrutura, testes e documentação; oito dependências dev fixadas, declarações/versões diretas de produção preservadas. Ajuste transitivo de `@types/estree` 1.0.9 para 1.0.10 pelo npm. Avisos existentes de peers OpenTelemetry foram registrados sem alterações laterais. Não instalar Faker, cobertura visual, provedores ou ferramentas de métricas sem necessidade aprovada.
- **Validação e limites:** checks locais e `npm ci` em dry-run; execução Linux/GitHub ainda pendente. No sandbox Windows, esbuild precisou de acesso de leitura adicional e o término da árvore temporária do servidor E2E exigiu permissão adicional. Sem commits, push ou operações de banco nesta etapa.
- **Reversão:** reverter somente o diff desta infraestrutura e seus registros em revisão, preservando arquivos de produção, schema/seed/SQL e licenças; sem reset, limpeza ou remoção de dados automática.
- **Atualização em T1.2.1:** a implementação acima foi revisada e aprovada pelo usuário para versionamento, condicionada aos checks finais. Lint, typecheck, quatro testes Vitest, build e dois testes Chromium passaram novamente; infraestrutura registrada em `e631a49`. T1.2 concluída localmente. O status inicial e as limitações acima preservam o histórico da implementação; CI remota, cobertura do seed e testes autenticados continuam pendentes. Sem push ou início de T2.

## D-008 — Conciliação de T2.3 e gráficos demonstrativos em Analytics

- **Status:** direcionamento e conciliação autorizados expressamente pelo usuário nesta conversa; implementação sujeita à revisão, sem commits nesta etapa.
- **Contexto:** o TASKS versionado e os relatórios anteriores chamavam T2.3 de loading, erro, estado vazio e acessibilidade. O usuário identifica o planejamento esperado como Gráficos e Analytics; essa numeração não foi localizada nos documentos atuais. D-006 e D-007 não impedem a conciliação nem exigem dados reais na fase demonstrativa.
- **Decisão:** manter os registros de T2.1/T2.2; reservar T2.3 aos três gráficos demonstrativos em `/analytics` e transferir o escopo anterior, com sua descrição histórica, para T2.4. Não iniciar T2.4. T7.1 mantém Analytics com agregações reais e filtros, após segurança e preparação dos dados.
- **Apresentação e dados:** reutilizar Recharts 3.10.1 instalado, Card, layout e fontes existentes. Fixtures separadas e tipadas, sem consultas: outubro/2026 com 32 admissões; 12 departamentos somando 1.176 ativos; situação com 1.176 ativos e 72 desligados, somando 1.248. Série temporal representa admissões, sem prometer histórico auditável do quadro de pessoas.
- **Acessibilidade:** títulos, descrições, legendas/rótulos e resumo textual com todos os valores; identificação demonstrativa por gráfico. Não depender só de cor ou tooltip. Estados avançados e revisão complementar ficam para T2.4, sem dispensar requisitos básicos agora.
- **Limites:** preservar Dashboard/KPIs, navegação, demais páginas, CSS global, dependências, schema/seed e autenticação. Sem tabelas, CRUD, banco, gráficos no Dashboard principal ou commits. Alteração documental pontual, sem reescrever o backlog ou decisões anteriores.
- **Atualização em T2.3.1:** implementação e conciliação revisadas e aprovadas pelo usuário para versionamento. Lint, typecheck, 18 testes Vitest (incluindo repetição), build e 11 cenários Playwright passaram novamente; coerência das fixtures, resumos textuais e ausência de overflow nas três larguras confirmadas. Implementação registrada em `a7b5fd2`, com documentação em commit separado. O status inicial e os limites acima preservam o histórico da etapa de implementação; esta autorização permite somente os dois commits locais de encerramento. Sem push, novas funcionalidades ou início de T2.4. Execução remota da CI permanece pendente.

## Modelo para novas decisões

### D-XXX — Título

- **Data:** AAAA-MM-DD
- **Status:** proposta | aprovada | substituída
- **Contexto:**
- **Decisão:**
- **Alternativas avaliadas:**
- **Impacto:**
- **Migração/rollback (se aplicável):**
- **Aprovação:**
