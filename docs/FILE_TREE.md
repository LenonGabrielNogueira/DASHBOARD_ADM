# FILE_TREE.md — Árvore-alvo comentada

> **Importante:** estrutura planejada, **não** é uma ordem para sobrescrever a base existente. Criar apenas arquivos necessários à tarefa liberada. Diretórios e nomes podem ser adaptados após T0.1.

## Inventário atual — T0.1/T0.2

| Área | Existente | Ainda planejado |
| --- | --- | --- |
| Raiz | AGENTS, README, TASKS, CODEX_START, package/lockfile, configurações Next/TS/ESLint/shadcn, `.gitignore`, `.env.example`, ZIP do planejamento | Organização/versionamento em T0.3 |
| `src/app` | `layout.tsx`, `page.tsx`, `globals.css`, favicon; página padrão | Cinco módulos, login, estados e layout do painel |
| `src/components/ui` | 16 componentes de UI | Componentes específicos de layout, gráficos e cadastros |
| `src/lib` | `utils.ts` | Prisma compartilhado, autorização, datas, validações e CSV |
| `prisma` | Schema com oito modelos, seed e `manual/assignment_no_overlap.sql` | Revisão de preparação; migrations locais não encontradas |
| `docs` | Arquitetura, modelo, árvore, decisões e guia original | Manter documentação alinhada a cada tarefa |
| `.github/workflows` | README de planejamento | Workflow CI em T1.3 |
| `public` | SVGs padrão Next/Vercel | Marca somente se aprovada |
| Qualidade | Scripts declarados; lint e tipos passaram em T0.1 | Vitest/Playwright, configs e suítes; build atual não validado |

`node_modules`, `.next`, `next-env.d.ts` e cache TypeScript também existem localmente; não são prova de implementação ou validação atual. Há arquivos não rastreados e alterações anteriores; T0.3 deverá avaliar o versionamento sem descartá-los. Nenhuma pasta é criada por esta árvore.

## Árvore planejada conforme D-006

```text
DASH-ADMIN/BASE-DASH-001/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI: lint, typecheck, testes e build
├── docs/
│   ├── ARCHITECTURE.md              # Camadas, fluxos e limites do MVP
│   ├── FILE_TREE.md                 # Esta árvore + responsabilidades
│   ├── DATA_MODEL.md                # Modelos existentes e contrato de indicadores
│   └── DECISIONS.md                 # Registro de decisões e aprovações
├── prisma/
│   ├── schema.prisma                # Oito modelos existentes: preservar
│   ├── migrations/                 # Histórico versionado das migrações
│   ├── manual/assignment_no_overlap.sql # SQL existente; aplicação não verificada
│   └── seed.ts                     # Existente; revisão e execução só com aprovação
├── public/
│   └── logo.svg                    # Marca estática do dashboard, se aprovada
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── sign-in/[[...sign-in]]/
│   │   │       └── page.tsx         # Tela Clerk de login
│   │   ├── (dashboard)/             # Route group: não muda a URL
│   │   │   ├── layout.tsx           # Layout protegido: sidebar e header
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # KPIs, gráficos e últimas admissões
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx         # Gráficos analíticos e período
│   │   │   ├── pessoas/
│   │   │   │   └── page.tsx         # Lista, busca e ações de cadastro
│   │   │   ├── departamentos/
│   │   │   │   └── page.tsx         # Gestão de departamentos
│   │   │   └── relatorios/
│   │   │       └── page.tsx         # Relatórios filtráveis
│   │   ├── api/
│   │   │   └── export/pessoas/
│   │   │       └── route.ts         # CSV, autorização e escape de fórmulas
│   │   ├── layout.tsx               # Layout raiz e ClerkProvider
│   │   ├── page.tsx                 # Entrada: redireciona /dashboard
│   │   ├── globals.css              # Estilos globais atuais: preservar
│   │   ├── loading.tsx              # Estado de carregamento global
│   │   ├── error.tsx                # Tratamento de erro de UI
│   │   └── not-found.tsx            # Rota inexistente
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx          # Menu lateral e links
│   │   │   └── header.tsx           # Título, contexto e usuário
│   │   ├── dashboard/
│   │   │   ├── kpi-card.tsx         # Componente de indicador numérico
│   │   │   ├── period-filter.tsx    # Escolha de período para dados temporais
│   │   │   └── recent-hires.tsx     # Admissões recentes
│   │   ├── charts/
│   │   │   ├── hires-line-chart.tsx # Evolução temporal de admissões
│   │   │   ├── departments-bar.tsx  # Pessoas por departamento
│   │   │   └── status-donut.tsx     # Distribuição ativo/inativo
│   │   ├── people/
│   │   │   ├── people-table.tsx     # Tabela paginada de colaboradores
│   │   │   └── person-form.tsx      # Formulário de criação/edição
│   │   └── ui/                      # Componentes shadcn gerados/reutilizados
│   ├── server/
│   │   ├── queries/
│   │   │   ├── dashboard.ts         # KPIs e agregações autorizadas
│   │   │   ├── people.ts            # Person e PersonAssignment: filtros e detalhe
│   │   │   ├── departments.ts       # Listagem e contagens
│   │   │   └── reports.ts           # Consultas de relatórios
│   │   └── actions/
│   │       ├── people.ts            # Criar, editar, desligar e manter vínculos
│   │       └── departments.ts       # Manter departamentos
│   ├── lib/
│   │   ├── db.ts                    # Cliente Prisma singleton
│   │   ├── admin-auth.ts            # Guard de administrador no servidor
│   │   ├── date-range.ts            # Normalização de períodos
│   │   ├── csv.ts                   # Serialização CSV segura
│   │   ├── utils.ts                 # Utilidades gerais
│   │   └── validations/
│   │       ├── person.ts            # Schema Zod para pessoa e vínculo
│   │       └── department.ts        # Schema Zod para departamento
│   ├── types/
│   │   ├── dashboard.ts             # Tipos dos KPIs e séries de gráficos
│   │   └── filters.ts               # Tipos de busca/paginação/período
│   └── proxy.ts                     # Clerk + roteamento Next 16; não é auth final
├── tests/
│   ├── unit/
│   │   ├── date-range.test.ts       # Limites de período/timezone
│   │   └── validation.test.ts       # Campos inválidos e entradas válidas
│   ├── integration/
│   │   ├── dashboard-queries.test.ts # Testes de agregações/dados
│   │   └── auth-guard.test.ts       # Acesso negado sem permissão
│   └── e2e/
│       └── dashboard.spec.ts        # Login, tela, CRUD e exportação
├── .env.example                    # Nomes de variáveis sem segredos reais
├── .gitignore                      # Exclui .env, outputs e artefatos
├── AGENTS.md                       # Regras do Codex
├── TASKS.md                        # Fases e critérios de aceite
├── CODEX_START.md                  # Primeiro prompt de auditoria
├── README.md                       # Visão, setup e escopo do projeto
├── components.json                 # Config shadcn/ui (se já usada)
├── next.config.ts                  # Configuração Next existente
├── package.json                    # Scripts e dependências existentes
├── package-lock.json               # Lockfile reproduzível
├── prisma.config.ts                # Opcional; depende da versão do Prisma
├── tsconfig.json                   # Compilador TypeScript
└── vitest.config.ts                # Configuração dos testes unitários
```

## Notas de implementação

- A árvore separa responsabilidades, mas **não exige** que todos os arquivos existam desde o primeiro commit.
- `src/proxy.ts` é apropriado para Next.js 16 com `src/app`; para versões diferentes, validar a convenção antes de editar.
- `prisma.config.ts` depende da versão Prisma em uso. Não criar automaticamente.
- O domínio usa `Person`, `PersonAssignment`, `Department` e `Position`; rótulos e rotas são em português (`/pessoas`, `/departamentos`). Os nomes futuros acima são planejamento, não renomeações de arquivos existentes.
- `src/server/*` não deve ser importado por Client Components.
- O dashboard usa **admissões recentes**. `AuditLog`, `MetricSnapshot` e `ReportSchedule` já existem no schema e são preservados para funcionalidades futuras; não criar `ActivityLog` por exemplos anteriores.
- As rotas e ações sensíveis exigem um `requireAdmin()` ou equivalente no lado servidor.
- Exportação CSV só é necessária quando a tarefa T7.3 for autorizada.
- `Organization` e `Position` são suporte técnico do MVP; não exigem telas próprias. Organização é resolvida no servidor e cargos vêm de catálogo previamente aprovado, conforme `DATA_MODEL.md`.
- O guia `guia-dashboard-admin.md` é histórico e permanece no local atual, sem mover/excluir diretórios ou ativar sua árvore `src/features`.
