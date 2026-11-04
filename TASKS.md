# TASKS.md — Backlog executável para o Codex

> **Regra:** só uma tarefa por vez. `[ ]` = não validada no repositório atual. Não marque tarefas como concluídas com base somente em planejamentos anteriores.

## Visão por fase

| Fase | Entrega | Dependência | Evidência de conclusão |
| --- | --- | --- | --- |
| 0 | Diagnóstico, conciliação e organização da base | — | relatório, documentação revisada e plano de versionamento |
| 1 | Base e qualidade | fase 0 | scripts e CI funcionando |
| 2 | Shell e mock de UI | fase 1 | navegação responsiva e telas sem dados reais |
| 3 | Segurança com Clerk | fase 2 | testes de acesso e autorização server-side |
| 4 | Preparação dos dados existentes | fase 3 + aprovação específica de operações de dados | schema preservado e procedimento de demonstração seguro |
| 5 | KPIs e gráficos reais | fase 4 | dados auditáveis e filtros testados |
| 6 | CRUD | fase 5 | edição/inativação com validações e acesso seguro |
| 7 | Analytics, relatórios e CSV | fase 6 | consultas, filtros e exportação seguros |
| 8 | QA, acessibilidade e deploy | fase 7 | checklist MVP completo |

## Fase 0 — Auditoria e documentação (sem implementação funcional)

D-006 é a referência vigente. O guia original é histórico. T0.1 a T0.4 e T1.1 foram revisadas e aprovadas; T1.1.2 registrou fontes e documentação na branch existente. O usuário ampliou T1.2 para incluir RTL/jsdom, Playwright e CI; após revisão, T1.2.1 validou e registrou a infraestrutura localmente. Execução remota da CI, fases seguintes, integração de históricos e push permanecem fora do escopo.

- [x] **T0.1** — Auditoria técnica concluída e reconhecida pelo usuário. Inspecionados Git, scripts, stack, estrutura e planejamento. Lint/typecheck passaram; Vitest/Playwright ausentes; build não executado para preservar a restrição de escrita. Banco não acessado. **Aceite:** relatório entregue na conversa; resumo em `README.md`.
- [x] **T0.2** — Conciliação documental revisada e aprovada pelo usuário para encerramento: preservados oito modelos, adotados `Person`/`PersonAssignment`, cinco módulos, organização única com isolamento e regras de indicadores. D-006 aprovada; histórico anterior preservado. **Aceite:** revisão dos oito documentos aprovada nesta conversa.
- [x] **T0.3** — Diagnóstico e preparação revisados e aprovados pelo usuário. Alterados somente `.gitignore`, `.env.example`, `TASKS.md` e `README.md`: inventário Git, proteções de testes, exceção do exemplo de ambiente, regra específica do ZIP, `DIRECT_URL` e plano de commits. Alterações locais preservadas; durante esta preparação não houve branch, staging, commit ou operação de banco. **Aceite:** revisão dos quatro arquivos e validações aprovada antes de T0.4.
- [x] **T0.4** — Estado existente consolidado na branch `feat/T1.1-setup`, com staging explícito e revisão dos grupos: `ae8d97a` — `docs: consolida arquitetura e planejamento do Dashboard ADM`; `6eea10b` — `chore: define regras de versionamento e exemplo de ambiente`; `ab82586` — `chore: registra base Next.js existente`. **Aceite:** três commits revisados e aprovados pelo usuário, árvore limpa, sem mudanças funcionais, de schema/seed/SQL ou operações de banco e sem push.

## Fase 1 — Base do desenvolvimento

- [x] **T1.1** — Validação da fundação técnica encerrada por autorização expressa do usuário em T1.1.2, após revisão de T1.1.1. `npm run lint`, `npm run typecheck` e `npm run build` aprovados com Geist/Geist Mono locais e build sem acesso ao Google Fonts; dependências preservadas. **Histórico do aceite original:** previa também `npm test` executando testes ou suíte vazia explicitamente configurada. **Ajuste de encerramento aprovado:** testes não foram apresentados como aprovados; Vitest, preparação do Playwright e cobertura complementar de tipos seguem pendentes em T1.2, sem execução automática.
- [x] **T1.1.1** — Correção de fontes revisada e aprovada: `next/font/local`, WOFF2 variáveis oficiais Geist/Geist Mono 1.4.2, licenças OFL preservadas, variáveis existentes e correção exclusiva de `--font-sans`. Lint, typecheck e build offline aprovados; nenhuma funcionalidade de negócio alterada.
- [x] **T1.1.2** — Encerramento e registro autorizados: reconferência de fontes/licenças e escopo, atualização exclusiva de TASKS/README, repetição de lint/typecheck/build e `git diff --check`, com commits separados para fontes e documentação. T0.3/T0.4 formalizadas sem apagar histórico. Evidência dos hashes finais no relatório da execução; sem push, banco ou início de T1.2.
- [x] **T1.2** — Configurar Vitest e primeiros testes de utilitários/validação; não modificar stack sem aprovação. Incluir proposta de preparação do Playwright (fluxos autenticados continuam em T8.1) e cobertura complementar de tipos para configurações e scripts fora do `include` atual, incluindo seed, sem executá-lo. Vitest/Playwright e Faker ausentes foram diagnosticados; qualquer instalação exige aprovação específica, e a revisão funcional do seed permanece em T4.3. **Aceite:** pelo menos dois testes efetivos, `npm test` passa; registrar alcance das checagens e limitações do E2E.
  **Execução autorizada nesta conversa:** instaladas oito dependências de desenvolvimento fixadas; quatro testes de `cn`/`Button`, dois cenários públicos Playwright, checagem complementar de configurações/testes e workflow CI em dois jobs. Lint, typecheck, unitários e build aprovados localmente; E2E passou com necessidade de permissão adicional para encerramento do servidor no sandbox Windows. Seed continua excluído explicitamente da checagem complementar por falta de Faker/cliente gerado, sem stubs ou operações de banco; revisão permanece em T4. Aguardando revisão antes de concluir ou criar commits. Detalhes, versões e limitações no README e D-007.
  **Encerramento local em T1.2.1:** revisão aprovada pelo usuário e validações repetidas com sucesso: lint, tipos da aplicação/tooling, quatro testes Vitest, build e dois testes Chromium, sem Clerk/PostgreSQL. Infraestrutura registrada em `e631a49`, com staging explícito e checagem do índice aprovada. A espera por revisão descrita acima registra a etapa anterior. CI criada e revisada, mas execução remota ainda pendente; cobertura do seed permanece em T4.3 e testes autenticados em T8.1. Nenhuma funcionalidade de produção alterada; T2 não iniciada.
- [ ] **T1.3** — Criar CI GitHub Actions para instalar com lockfile, lint, typecheck, test e build, sem segredos reais. **Aceite:** workflow verificável em PR. **Conciliação:** o workflow foi entregue para revisão no escopo ampliado de T1.2 por autorização expressa do usuário; não foi executado remotamente nem marcado como concluído. Não criar CI duplicada ao revisar esta tarefa.

## Fase 2 — Interface sem banco

- [x] **T2.1** — Criar shell do aplicativo: layout, sidebar, header, navegação e rotas vazias (`/dashboard`, `/analytics`, `/pessoas`, `/departamentos`, `/relatorios`). **Aceite:** navegação funciona no desktop e no mobile; `globals.css` preservado.
  **Conclusão revisada e aprovada em T2.1.1:** cinco rotas implementadas no grupo `(dashboard)`, com layout administrativo compartilhado, sidebar, header, título/descrição e estado de módulo em desenvolvimento. Menu responsivo com rota ativa, abertura/fechamento mobile, suporte a teclado e fechamento ao navegar. Lint, typecheck, sete testes Vitest (incluindo repetição), build e cinco cenários Playwright aprovados, incluindo navegação em 320, 768 e 1440 px sem overflow horizontal. Os 16 arquivos aprovados foram registrados no commit `dd0f4ef`, com staging explícito e checagem do índice sem erros. Página inicial, fontes locais, estilos globais, dependências e arquivos de produção anteriores preservados; sem integração com banco ou autenticação, sem gráficos/KPIs e sem push. T2.2 não iniciada.
- [x] **T2.2** — Adicionar cards de KPI, estrutura dos gráficos e tabelas com fixtures identificadas como **demonstração**. **Aceite:** componentes responsivos; sem dados simulados fingindo persistência.
  **Recorte aprovado e concluído em T2.2.1:** quatro indicadores demonstrativos (total de colaboradores, colaboradores ativos, total de departamentos e admissões no período), com contratos TypeScript, ícones controlados, `KpiCard`, `KpiGrid` e `DashboardOverview`. Fixtures fixas separadas em `src/lib/demo/dashboard.ts`; formatação pt-BR, tratamento de zero, null e valores não finitos, aviso geral e identificação demonstrativa em cada card. Lint, typecheck, 13 testes Vitest (incluindo repetição), build e oito cenários Playwright aprovados; grade de uma, duas e quatro colunas em 320, 768 e 1440 px sem overflow horizontal e navegação preservada. Os nove arquivos aprovados foram registrados em `167d486`, com staging explícito e checagem do índice sem erros. Sem integração real com banco, autenticação, queries ou Server Actions; dependências, estilos globais e outros módulos preservados. A estrutura de gráficos e tabelas mencionada no escopo original não foi implementada no recorte autorizado e depende de tarefa e aprovação próprias. T2.3 permanece pendente, sem início automático ou push.
- [ ] **T2.3** — Adicionar loading, erro, estado vazio e acessibilidade básica. **Aceite:** navegação por teclado e títulos/labels consistentes.

## Fase 3 — Autenticação e autorização

- [ ] **T3.1** — Auditar integração atual do Clerk antes de implementar auth; propor allowlist administrativa e configuração server-side da organização operacional existente. Não exigir seletor, webhook ou provisionamento por Clerk Organizations. **Aceite:** plano validado, sem valores secretos ou criação automática de organização.
- [ ] **T3.2** — Implementar login/saída e proteção de páginas; com Next.js 16 usar `proxy.ts`, mas nunca depender exclusivamente dele. **Aceite:** não autenticado não acessa painel.
- [ ] **T3.3** — Criar guard server-side para páginas, queries, actions e exportação, resolvendo organização confiável e validando relações no mesmo escopo. **Aceite:** negar usuário sem permissão e acesso a registros de outra organização, inclusive por IDs enviados diretamente; testes cobrindo negações.

## Fase 4 — Dados existentes (operações e mudanças exigem aprovação específica)

- [ ] **T4.1** — Avaliar os oito modelos preservados, histórico local de migrations, integridade, índices e SQL manual. Propor preparação da organização existente (incluindo `clerkOrgId`) e catálogo mínimo de `Position`, reaproveitando registros válidos da mesma organização. Documentar ambiente, impacto e rollback. **Aceite:** plano aprovado antes de qualquer escrita; sem substituição automática por `Employee`.
- [ ] **T4.2** — Preparar cliente Prisma compartilhado e conexão por ambiente somente no escopo aprovado. Geração de cliente, acesso remoto e migrations dependem de autorização própria; migration não é pressuposto desta tarefa. **Aceite:** configuração e procedimento reproduzíveis, sem perda de dados e sem mudanças de schema não aprovadas.
- [ ] **T4.3** — Revisar o seed existente e propor procedimento seguro e determinístico para demonstração e catálogo de cargos, incluindo dependência Faker, data de referência fixa e proteção contra exclusões indevidas. Preferir provisionamento idempotente sem reset de dados. **Aceite:** revisão e aprovação separadas para editar e executar; nenhum seed executado por aprovação documental.

## Fase 5 — Dashboard com dados do servidor

- [ ] **T5.1** — Criar queries agregadas sobre `Person`, `Department` e `PersonAssignment`, conforme `DATA_MODEL.md`, com contagem única por pessoa. **Aceite:** testes de organização, arquivamento, admissões futuras, desligamentos, vigências, sobreposições e bordas de datas; sem multiplicação por joins.
- [ ] **T5.2** — Conectar gráficos: admissões mensais, pessoas ativas por departamento e situação ativa/inativa derivada das datas. **Aceite:** soma dos departamentos mais categoria de inconsistências igual ao total ativo; rosca soma o total admitido; nenhum KPI hardcoded ou dependência de snapshots.
- [ ] **T5.3** — Filtro de período consistente, cartões de resumo e lista de admissões recentes. **Aceite:** período altera só métricas temporais pertinentes; respostas vazias estáveis.

## Fase 6 — Administração de cadastros

- [ ] **T6.1** — Listagem de pessoas: busca, paginação, filtros e tabela; sempre filtragem server-side. **Aceite:** consulta paginada e protegida.
- [ ] **T6.2** — Cadastro/edição/desligamento de `Person` com `PersonAssignment`, usando cargos e departamentos válidos da organização. Mudanças de cargo/departamento e desligamento preservam vigência em transação; sem recontratação, vínculos simultâneos ou edição retroativa. **Aceite:** validar duplicados, datas, escopo, concorrência e catálogo ausente; bloquear vínculos inconsistentes; atualizar UI.
- [ ] **T6.3** — Listagem/cadastro/edição de departamentos; arquivamento bloqueado com vínculos vigentes/futuros ou filhos não arquivados. Preservar referências históricas e hierarquia existente, sem editor de árvore. **Aceite:** integridade referencial e escopo preservados; sem exclusão física.

## Fase 7 — Analytics e relatórios

- [ ] **T7.1** — Analytics com agregações filtradas e comparação visual acessível. **Aceite:** filtros documentados e compatíveis com KPIs.
- [ ] **T7.2** — Relatório de pessoas com situação derivada, departamento e admissão; usar vínculo vigente para ativos e último encerrado para inativos, conforme `DATA_MODEL.md`. **Aceite:** uma linha por pessoa, filtros explícitos e total consistente; histórico completo fora do MVP.
- [ ] **T7.3** — Exportação CSV protegida, UTF-8, cabeçalhos claros, limites/streaming conforme volume e proteção contra CSV injection. **Aceite:** teste de permissão, de filtros e de escapamento.

## Fase 8 — Entrega

- [ ] **T8.1** — Testes E2E com Playwright: login, bloqueios, navegação, cadastro/inativação, CSV. **Aceite:** suíte reproduzível.
- [ ] **T8.2** — Polimento mobile, acessibilidade, performance e estados de erro; sem redesign global não autorizado. **Aceite:** checklist revisado.
- [ ] **T8.3** — Documentar setup local, seed fictício, variáveis, deploy, screenshots e limitações; executar CI. **Aceite:** README atualizado e demonstração pronta para portfólio.

## Expansões futuras (sem autorização de execução)

- [ ] Organograma interativo, manutenção avançada de cargos/hierarquias e relações de liderança.
- [ ] Multiempresa/multitenancy e permissões por organização.
- [ ] Inngest para tarefas programadas; S3/ImageKit para uploads.
- [ ] Relatórios PDF/XLSX, métricas personalizáveis e alertas.
- [ ] Auditoria funcional sobre `AuditLog`, snapshots sobre `MetricSnapshot` e relatórios agendados sobre `ReportSchedule`, sem remover esses modelos.
- [ ] Recontratação, vínculos simultâneos, correções retroativas e histórico completo auditável.

## Regras de aceite para qualquer tarefa

- Revisar `git diff` e listar efeitos colaterais.
- Rodar checks aplicáveis e registrar resultado real (não inventar passes).
- Não marcar checkbox antes de revisão.
- Atualizar `docs/DECISIONS.md` quando houver decisão arquitetural.
- Uma tarefa por PR e nenhuma alteração fora de escopo sem aprovação.
