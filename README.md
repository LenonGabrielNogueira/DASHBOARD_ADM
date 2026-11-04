# DASHBOARD_ADM
Dashboard ADM
An organizational administration and analytics dashboard built with Next.js, React, TypeScript, and Tailwind CSS.

Dashboard ADM is a modular web application for presenting organizational indicators, exploring workforce analytics, and laying the groundwork for administrative workflows. Its current release is a working frontend demonstration, with responsive navigation, KPI cards, interactive charts, and accessible loading, empty, and error states. Authentication, production data access, CRUD operations, and downloadable reports are planned, not yet implemented.
Project status (November 4, 2026): Development through T2.4 is complete and committed locally. T2.5 (visual and UX audit) is next. The data shown in the UI is explicitly synthetic demonstration data, not information from an organization or a live database.

Contents
- Overview
- Implemented features
- Application pages
- Technology stack
- Architecture
- Project structure
- Getting started
- Demo data
- Testing and quality
- Data model and security plans
- Roadmap
- Current limitations
- Documentation
- Development workflow
Overview
This project emphasizes a clean, straightforward administrative experience, reusable components, typed data contracts, and incremental delivery. It began as an independent portfolio application inspired by the technology choices used for the PrismaOfertas project.

The initial product focus is organizational and workforce analytics: employees, departments, admission trends, employment status, and reports. The target MVP has five modules: Dashboard, Analytics, People, Departments, and Reports.
Implemented features
Responsive application shell
- Shared administrative layout with a desktop sidebar and top header.
- Mobile navigation with keyboard support, focus management, and accessible dismissal.
- Active navigation indication and a skip-to-content link.
- Reusable page headers and consistent module placeholders.
- Tested layouts at 320 px, 768 px, and 1440 px for the primary views; additional viewport review is planned for T2.5.
KPI dashboard
Four reusable KPI cards are available on /dashboard:
1. Total employees.
2. Active employees.
3. Total departments.
4. Admissions in the reporting period.
The cards support Brazilian Portuguese number formatting (pt-BR), numeric zero, unavailable values, descriptive text, and explicitly labeled demo data. They are built from typed props rather than hard-coded business logic inside the presentation components.
Analytics
The /analytics page provides three Recharts visualizations:
- Monthly admissions: line chart.
- Active employees by department: horizontal bar chart covering 12 departments.
- Employment status: donut chart for active and terminated employees.
Charts include titles, descriptions, labels, and textual equivalents of their demonstrated values. Accessible interaction and responsive rendering are covered by automated checks.
UI states and accessibility
A typed state model supports loading, success, empty, and error for independent dashboard sections.
- Skeleton placeholders for KPIs and charts, including route-level loading components for Dashboard and Analytics.
- Contextual empty states that do not replace missing data with fabricated values.
- Controlled error feedback and a client-side render-error boundary with a retry action where a real rerender can occur.
- Support for aria-busy, status/alert announcements, visible focus, reduced motion, and accessible chart descriptions.
- Independent graph states to avoid replacing an entire analytics page because one section is unavailable.
Error-boundary scope: client render boundaries do not automatically handle Server Component failures, SSR failures, event handlers, or future asynchronous/server operations. Those require separate handling when implemented.
Application pages
Route	Current implementation
/	Existing public starter page, preserved
/dashboard	Four demonstrative KPIs with state handling
/analytics	Three demonstrative charts with state handling
/pessoas	Page shell and development placeholder
/departamentos	Page shell and development placeholder
/relatorios	Page shell and development placeholder


The administrative pages currently contain public demo content. They are not authenticated or authorized yet; do not display private company information in them.
Technology stack
The following versions were reported and validated during development; use package.json and package-lock.json as the authoritative versions in your checkout.
Area	Technology
App	Next.js 16.4.3 (App Router), React 19.3.0
Language	TypeScript 5.9.3
Styling	Tailwind CSS 4.3.3, shadcn/ui components, Base UI, Geist fonts
Icons and charts	Lucide React, Recharts 3.10.1
Planned data layer	Prisma ORM 6.19.0 and Neon PostgreSQL
Planned authentication	Clerk 7.9.20
Unit/component testing	Vitest 4.1.12, React Testing Library, jsdom
Browser testing	Playwright 1.58.2
CI configuration	GitHub Actions (defined locally; remote execution unverified)


Supporting packages for forms, validation, tables, and more advanced workflows are present in the project but are not evidence of completed corresponding features.
Architecture
The application separates visual concerns from data contracts and data sources:
Next.js App Router pages and shared layouts
           |
           v
Reusable UI components (layout / dashboard / charts / states)
           |
           v
TypeScript contracts and demonstration fixtures

Future protected data path:
Authenticated page or action
           |
           v
Server-side authorization + organization scope
           |
           v
Queries / mutations -> Prisma -> PostgreSQL
The charts and cards consume structured props. Demonstration fixtures are stored separately, allowing a future change to authorized server-side queries without rewriting the presentation layer unnecessarily.
Architectural principles
- Small, reviewable tasks; inspect before changing.
- Explicit separation of completed features and planned capabilities.
- No schema, seed, or styling changes outside an approved task.
- Server-side access checks before any sensitive read or write.
- Organization-scoped data operations and consistency checks when the backend is implemented.
- Automated checks and incremental Git commits.
Project structure
A condensed view of the implemented and preserved project layout:
BASE-DASH-001/
├── AGENTS.md                     # Codex instructions and constraints
├── TASKS.md                      # Task backlog and completion history
├── README.md                     # Project overview
├── CODEX_START.md                # Original Codex kickoff instructions
├── docs/
│   ├── ARCHITECTURE.md           # Architectural decisions and data flow
│   ├── DATA_MODEL.md             # Data model and metric definitions
│   ├── FILE_TREE.md              # Detailed file responsibilities
│   ├── DECISIONS.md              # Decision log (including D-006, D-008, D-009)
│   └── guia-dashboard-admin.md   # Historical planning reference
├── prisma/
│   ├── schema.prisma             # Preserved existing schema
│   ├── seed.ts                   # Existing seed; do not run without review
│   └── manual/
│       └── assignment_no_overlap.sql
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/         # KPI page and route loading
│   │   │   ├── analytics/         # Charts page and route loading
│   │   │   ├── pessoas/
│   │   │   ├── departamentos/
│   │   │   └── relatorios/
│   │   ├── fonts/geist/          # Versioned local fonts and licenses
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/               # Sidebar, header, mobile nav, shell
│   │   ├── dashboard/            # KPI cards and overview
│   │   ├── charts/               # Recharts components and overview
│   │   ├── states/               # State feedback and error boundary
│   │   └── ui/                   # Existing UI primitives
│   ├── lib/
│   │   ├── demo/                 # Synthetic dashboard and analytics fixtures
│   │   ├── ui-state.ts
│   │   └── utils.ts
│   └── types/                    # Dashboard, analytics, UI state contracts
├── tests/
│   ├── unit/
│   ├── components/
│   └── e2e/
├── .github/workflows/ci.yml      # Configured; remote run pending
├── vitest.config.mts
├── playwright.config.ts
├── tsconfig.tooling.json
├── .env.example
├── package.json
└── package-lock.json
See [`docs/FILE_TREE.md`](docs/FILE_TREE.md) for the documented file-by-file structure.
Getting started
Prerequisites
- Node.js and npm compatible with the project's dependency lockfile. Local validation used Node.js 26.3.0 / npm 11.9.0; the GitHub Actions workflow is configured for Node.js 24. Node 24 CI execution remains unverified.
- A local copy of the repository.
Install and run
npm ci
npm run dev
Open http://localhost:3000/dashboard or http://localhost:3000/analytics.

No real database or Clerk credentials are required to preview the current demonstrative interface. The .env.example documents the variables reserved for later integrations; do not commit actual secrets.
Production build
npm run build
npm run start
Geist and Geist Mono are bundled locally under src/app/fonts/geist/ using next/font/local, so a build does not need to download those fonts from Google Fonts. The original font licenses and source notes are preserved alongside the assets.
Database safety: do not run Prisma migrations or prisma/seed.ts merely to start the current demo. The existing seed can delete and recreate organization-related records and still requires a safety review.

Demo data
The current interface deliberately uses synthetic, clearly labeled example data:
Metric	Demo value
Total employees	1,248
Active employees	1,176
Terminated employees	72
Departments	12
Admissions in October 2026	32


These figures reconcile as 1,176 active + 72 terminated = 1,248 total. The department distribution totals 1,176 active employees, and the monthly admission series for May–October 2026 is 24, 28, 36, 25, 30, 32.

The reference period for the demonstrative admission KPI is October 1–31, 2026. These values must not be presented as live operational metrics.
Testing and quality
Run the same core checks used during implementation:
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
The typecheck script also invokes a tooling TypeScript configuration that covers relevant project configuration and test files outside src/. The existing Prisma seed is not yet included in that coverage.
Last reported local validation (November 4, 2026)
Check	Reported result
ESLint	Passed
Application and tooling typechecks	Passed
Vitest	32 / 32 tests passed across 9 test files
Next.js production build	Passed
Playwright	12 / 12 scenarios passed
Git	Clean after the T2.4 documentation commit


These are passing test counts, not a claim of 100% code coverage. They were reported through Codex and terminal outputs; the current README does not constitute an independent fresh run.

The GitHub Actions workflow has been written with a quality job and a browser-testing job, but has not yet been observed passing on GitHub. Tests requiring credentials, a real database, or authenticated user workflows are future work.
Data model and security plans
The existing Prisma schema was intentionally retained rather than replaced with a simplified new schema. It contains:
Model	Intended role
Organization	Organization-level data scope
Person	People records and employment dates
Department	Organizational departments
Position	Job positions
PersonAssignment	Time-bounded person/department/position assignments
MetricSnapshot	Potential stored metric snapshots (future)
AuditLog	Potential auditing (future)
ReportSchedule	Scheduled reporting (future)


The initial backend MVP is planned for one trusted server-configured organization, while retaining organization identifiers and validating scope on server-side operations. Clerk-based administrator access and the creation/validation of the initial organization and position catalog remain future tasks.

Important: having a Prisma schema or an installed authentication package does not mean the application already has a working database connection, route protection, authorization, or safe multitenant isolation.
Roadmap
Phase	Work	Status
T0.1–T0.4	Audit, documentation reconciliation, repository organization	Complete
T1.1	Technical foundation and offline-capable font configuration	Complete
T1.2	Vitest, Playwright and CI configuration	Complete locally; GitHub run pending
T2.1	Layout, navigation and five routes	Complete
T2.2	Demonstrative KPI cards	Complete
T2.3	Recharts and demonstrative Analytics	Complete
T2.4	Loading, empty, error states and additional accessibility	Complete
T2.5	Visual/UX review and targeted fixes	Next; not started
T3	Clerk login and server-side administrative authorization	Planned
T4	Prisma/Neon integration, data integrity, safe seed review	Planned
Later MVP work	People and departments CRUD, real KPIs, filters, reports and CSV export	Planned
Future expansion	Organizational charts, advanced roles, audit workflows, scheduled reports	Deferred


An important upcoming milestone is a complete vertical workflow: an authorized administrator creates a person, assigns a department and position, persists the record, and sees the corresponding dashboard metric update from the database.
Current limitations
- Data is demonstrative, not live.
- Administrative routes do not yet enforce sign-in or administrator authorization.
- People, Departments, and Reports are presently placeholders rather than complete CRUD/reporting modules.
- Prisma schema, manual SQL and seed exist, but their application to a remote database has not been verified.
- The existing seed needs review before execution because of its potentially destructive behavior.
- Client error boundaries do not cover all future server, asynchronous, or event-driven failures.
- The GitHub Actions workflow has not yet been verified remotely.
- The local master and feat/T1.1-setup branches were reported to have unrelated histories; merging or publishing requires an explicit strategy.
Documentation
- [`AGENTS.md`](AGENTS.md) — contribution/automation instructions.
- [`TASKS.md`](TASKS.md) — chronological task backlog.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — architectural reference.
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — current model and KPI rules.
- [`docs/FILE_TREE.md`](docs/FILE_TREE.md) — directory and file responsibilities.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — architectural decision history.
The historical planning guide is retained for traceability; D-006 is the reference decision for the simplified MVP over the existing model. D-008 clarifies the Analytics task sequence, and D-009 documents section states and their error-boundary limits.
Development workflow
The project has followed a review-first development process:
1. Inspect the current files and decision log.
2. Propose a small, explicit change.
3. Implement only the approved scope.
4. Run relevant lint, typing, unit, build, and E2E checks.
5. Review diffs and unintended changes.
6. Commit code and documentation separately where appropriate.
7. Start the next task only after review.
Latest confirmed local commit: 35413df (docs: registra conclusao dos estados de interface T2.4) on feat/T1.1-setup. No remote push was confirmed by the reports used to prepare this README.
Dashboard ADM is under active development. The current implementation is a tested frontend foundation for a future authenticated, data-backed organizational administration application.
