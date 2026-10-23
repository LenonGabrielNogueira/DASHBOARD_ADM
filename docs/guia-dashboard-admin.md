# Guia passo a passo: Dashboard Administrativo Organizacional

Stack: **Next.js + TypeScript + Prisma + PostgreSQL (Neon) + Clerk + Inngest + Vercel**

> **Premissa deste guia:** o projeto é **multi-tenant** (várias organizações no mesmo sistema). Se for apenas uso interno, pule os trechos marcados com 🏢 e remova `organizationId` do schema.
>
> **Aviso de versões:** Next.js, Prisma, Clerk e Inngest mudam APIs com frequência. Os trechos de código são a base de raciocínio. Sempre confira a documentação da versão que você instalar.

---

## Visão geral das fases

| Fase | Entrega | Resultado visível |
|---|---|---|
| 0 | Decisões e contas | Ambiente pronto |
| 1 | Setup do projeto | App rodando com UI base |
| 2 | Banco + Prisma + seed | Dados fictícios no Neon |
| 3 | Auth + multi-tenant | Login e isolamento por organização |
| 4 | Layout (shell) | Sidebar, header, navegação |
| 5 | Pessoas, departamentos, cargos | CRUD completo |
| 6 | Organograma | Árvore interativa |
| 7 | Métricas e dashboard | KPIs e gráficos |
| 8 | Auditoria e permissões | RBAC + log |
| 9 | Relatórios e export | CSV/PDF agendados |
| 10 | Testes, deploy, observabilidade | Produção |

Regra de ouro: **só avance de fase quando a anterior estiver funcionando de ponta a ponta.**

---

## Fase 0: Decisões e contas

- [ ] Definir: uso interno ou SaaS? (este guia assume SaaS)
- [ ] Definir o nome do projeto e criar o repositório no GitHub
- [ ] Criar conta/projeto no **Neon** (região mais próxima dos usuários)
- [ ] Criar aplicação no **Clerk** e ativar **Organizations**
- [ ] Criar conta no **Inngest**
- [ ] Criar projeto na **Vercel** (conectar ao repositório depois)
- [ ] Listar as 5 perguntas que o dashboard precisa responder. Exemplo:
  1. Quantas pessoas temos hoje, por departamento?
  2. Quantas admissões e desligamentos no período?
  3. Qual a estrutura hierárquica atual?
  4. Quem reporta a quem?
  5. Como o headcount evoluiu nos últimos 12 meses?

Essas perguntas guiam quais gráficos existem. Gráfico sem pergunta é decoração.

---

## Fase 1: Setup do projeto

### 1.1 Criar o app

```bash
npx create-next-app@latest dashboard-admin \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd dashboard-admin
```

### 1.2 Instalar dependências

```bash
# UI
npx shadcn@latest init
npx shadcn@latest add button card input label select dialog dropdown-menu \
  table tabs badge avatar sheet sonner skeleton separator form

# Dados e formulários
npm i @prisma/client @tanstack/react-table react-hook-form zod @hookform/resolvers nuqs date-fns
npm i -D prisma tsx

# Gráficos e organograma
npm i recharts @xyflow/react @dagrejs/dagre

# Auth e jobs
npm i @clerk/nextjs inngest

# Utilitários
npm i lucide-react clsx
```

### 1.3 Estrutura de pastas

```
dashboard-admin/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (auth)/sign-in/[[...sign-in]]/page.tsx
│   │   ├── (auth)/sign-up/[[...sign-up]]/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── people/
│   │   │   ├── departments/
│   │   │   ├── positions/
│   │   │   ├── org-chart/page.tsx
│   │   │   ├── metrics/
│   │   │   ├── reports/
│   │   │   ├── audit-log/page.tsx
│   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── inngest/route.ts
│   │   │   ├── export/[type]/route.ts
│   │   │   └── webhooks/clerk/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── features/
│   │   ├── people/        (components/, actions.ts, queries.ts, schemas.ts)
│   │   ├── departments/
│   │   ├── positions/
│   │   ├── org-chart/     (components/, build-tree.ts, layout.ts)
│   │   ├── metrics/       (components/, queries.ts, snapshots.ts)
│   │   └── audit/
│   ├── components/
│   │   ├── ui/            (shadcn)
│   │   ├── data-table/
│   │   ├── charts/
│   │   └── layout/        (Sidebar, Topbar, Breadcrumbs)
│   ├── lib/
│   │   ├── db.ts
│   │   ├── tenant.ts
│   │   ├── auth.ts
│   │   ├── permissions.ts
│   │   ├── audit.ts
│   │   └── utils.ts
│   ├── inngest/
│   │   ├── client.ts
│   │   └── functions/
│   ├── hooks/
│   └── types/
├── .env.example
└── package.json
```

Crie as pastas aos poucos, conforme cada fase. Não precisa criar tudo agora.

### 1.4 Variáveis de ambiente

Crie `.env.local` (e um `.env.example` sem valores, versionado):

```env
# Neon: URL com pooler (app) e URL direta (migrations)
DATABASE_URL="postgresql://...-pooler.../db?sslmode=require"
DIRECT_URL="postgresql://.../db?sslmode=require"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

✅ **Checkpoint:** `npm run dev` abre o app sem erros.

---

## Fase 2: Banco de dados (Neon + Prisma)

### 2.1 Inicializar o Prisma

```bash
npx prisma init
```

Configure o datasource para usar as duas URLs (conforme a versão do Prisma, isso pode ficar em `schema.prisma` ou em `prisma.config.ts`):

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### 2.2 Schema inicial

```prisma
generator client {
  provider = "prisma-client-js"
}

model Organization {
  id         String   @id @default(cuid())
  clerkOrgId String   @unique
  name       String
  createdAt  DateTime @default(now())
}

model Department {
  id             String    @id @default(cuid())
  organizationId String
  parentId       String?
  name           String
  deletedAt      DateTime?
  createdAt      DateTime  @default(now())

  parent   Department?  @relation("DeptTree", fields: [parentId], references: [id])
  children Department[] @relation("DeptTree")

  @@index([organizationId, parentId])
}

model Position {
  id             String    @id @default(cuid())
  organizationId String
  title          String
  level          Int       @default(0)
  deletedAt      DateTime?

  @@index([organizationId])
}

model Person {
  id             String    @id @default(cuid())
  organizationId String
  clerkUserId    String?
  managerId      String?
  name           String
  email          String
  avatarUrl      String?
  hiredAt        DateTime
  terminatedAt   DateTime?
  deletedAt      DateTime?
  createdAt      DateTime  @default(now())

  manager Person?  @relation("Reports", fields: [managerId], references: [id])
  reports Person[] @relation("Reports")
  history PersonAssignment[]

  @@unique([organizationId, email])
  @@index([organizationId, managerId])
}

model PersonAssignment {
  id             String    @id @default(cuid())
  organizationId String
  personId       String
  departmentId   String
  positionId     String
  startDate      DateTime
  endDate        DateTime?

  person Person @relation(fields: [personId], references: [id])

  @@index([organizationId, personId, startDate])
  @@index([organizationId, departmentId, startDate, endDate])
}

model MetricSnapshot {
  id             String   @id @default(cuid())
  organizationId String
  date           DateTime @db.Date
  key            String
  dimension      String   @default("all")
  value          Decimal  @db.Decimal(18, 4)

  @@unique([organizationId, date, key, dimension])
  @@index([organizationId, key, date])
}

model AuditLog {
  id             String   @id @default(cuid())
  organizationId String
  actorId        String
  action         String
  entity         String
  entityId       String
  before         Json?
  after          Json?
  createdAt      DateTime @default(now())

  @@index([organizationId, createdAt])
  @@index([organizationId, entity, entityId])
}
```

> Sobre `department`/`position` em `PersonAssignment`: aqui estão como IDs simples para manter o exemplo curto. Em produção, adicione as relações (`@relation`) para ter integridade referencial.

### 2.3 Primeira migration

```bash
npx prisma migrate dev --name init
```

### 2.4 Migration manual: impedir períodos sobrepostos

```bash
npx prisma migrate dev --create-only --name no_overlap_assignments
```

Edite o `.sql` gerado:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "PersonAssignment"
ADD CONSTRAINT "assignment_no_overlap"
EXCLUDE USING gist (
  "personId" WITH =,
  tsrange("startDate", COALESCE("endDate", 'infinity'::timestamp)) WITH &&
);
```

Depois: `npx prisma migrate dev`.

### 2.5 Cliente Prisma (`src/lib/db.ts`)

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 2.6 Seed realista (`prisma/seed.ts`)

Gere **200 a 500 pessoas** em uma árvore de 4 a 5 níveis, 8 a 12 departamentos, 15 a 20 cargos e 24 meses de histórico de admissões e desligamentos. Sem volume, você não enxerga problemas de performance nem de layout do organograma.

Pontos do seed:
1. Criar a organização
2. Criar departamentos (com 2 ou 3 sub-departamentos)
3. Criar cargos por nível
4. Criar o CEO (sem `managerId`) e descer a árvore, escolhendo gestores do nível acima
5. Para cada pessoa, criar um `PersonAssignment` com `startDate = hiredAt`
6. Marcar ~10% como desligados (`terminatedAt` + `endDate`)

```json
// package.json
"prisma": { "seed": "tsx prisma/seed.ts" }
```

```bash
npx prisma db seed
```

✅ **Checkpoint:** `npx prisma studio` mostra os dados e a árvore faz sentido.

---

## Fase 3: Autenticação e multi-tenant 🏢

### 3.1 Clerk

1. Envolva o app com `<ClerkProvider>` em `src/app/layout.tsx`
2. Crie as páginas de sign-in e sign-up
3. Proteja as rotas do grupo `(dashboard)` no middleware

> Em versões recentes do Next.js, o arquivo `middleware.ts` pode ter sido renomeado para `proxy.ts`. Siga o quickstart do Clerk para a sua versão.

```ts
// middleware.ts (ou proxy.ts)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/api/inngest", "/api/webhooks(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
```

### 3.2 Sincronizar organização com o banco

Crie o webhook `src/app/api/webhooks/clerk/route.ts` para os eventos `organization.created`, `organization.updated` e `organizationMembership.*`, criando/atualizando a linha em `Organization`. Verifique a assinatura do webhook (Svix) antes de processar.

Cadastre a URL do webhook no painel do Clerk (use um túnel como ngrok em desenvolvimento).

### 3.3 Contexto da requisição (`src/lib/auth.ts`)

```ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function getContext() {
  const { userId, orgId, orgRole } = await auth();
  if (!userId || !orgId) throw new Error("UNAUTHORIZED");

  const org = await prisma.organization.findUnique({ where: { clerkOrgId: orgId } });
  if (!org) throw new Error("ORG_NOT_FOUND");

  return { userId, organizationId: org.id, role: orgRole ?? "org:member" };
}
```

### 3.4 Isolamento automático por organização (`src/lib/tenant.ts`)

Extensão do Prisma que injeta `organizationId` em todas as operações dos modelos de tenant:

```ts
import { prisma } from "@/lib/db";

const TENANT_MODELS = ["Department", "Position", "Person", "PersonAssignment", "MetricSnapshot", "AuditLog"];
const WHERE_OPS = ["findMany", "findFirst", "findFirstOrThrow", "count", "aggregate", "groupBy", "updateMany", "deleteMany"];

export function tenantDb(organizationId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!TENANT_MODELS.includes(model)) return query(args);
          const a = args as any;

          if (WHERE_OPS.includes(operation)) a.where = { ...a.where, organizationId };
          if (operation === "create") a.data = { ...a.data, organizationId };
          if (operation === "createMany") {
            a.data = (Array.isArray(a.data) ? a.data : [a.data]).map((d: any) => ({ ...d, organizationId }));
          }
          if (["findUnique", "findUniqueOrThrow", "update", "delete", "upsert"].includes(operation)) {
            // Chaves únicas não aceitam filtro extra em alguns casos:
            // valide a propriedade do registro antes (findFirst com organizationId).
          }
          return query(a);
        },
      },
    },
  });
}
```

**Regras de uso:**
- Nas features, **nunca** importe `prisma` direto. Use `tenantDb(ctx.organizationId)`.
- Para `update`/`delete` por `id`, faça antes um `findFirst({ where: { id } })` pelo cliente de tenant. Se não achar, o registro não pertence à organização.
- Queries `$queryRaw` precisam de `WHERE "organizationId" = ${orgId}` **manualmente**. Revise todas elas em code review.

✅ **Checkpoint:** crie 2 organizações no Clerk. Uma não pode ver dados da outra, nem por URL direta.

---

## Fase 4: Layout base (shell)

1. `src/components/layout/Sidebar.tsx`: links para Visão geral, Pessoas, Departamentos, Cargos, Organograma, Métricas, Relatórios, Auditoria, Configurações
2. `Topbar.tsx`: `OrganizationSwitcher` e `UserButton` do Clerk, busca global (opcional)
3. `src/app/(dashboard)/layout.tsx`: sidebar fixa no desktop, `Sheet` no mobile
4. Breadcrumbs e `loading.tsx` com `Skeleton` nas rotas principais
5. Tema claro/escuro (opcional, mas barato com shadcn)

Esconda itens do menu conforme o papel (ex.: auditoria só para admin). Isso é conveniência. A segurança real fica no servidor (Fase 8).

✅ **Checkpoint:** navegação completa entre páginas vazias, responsiva.

---

## Fase 5: CRUD de Pessoas, Departamentos e Cargos

Faça **Pessoas** primeiro e repita o padrão nos outros.

### 5.1 Padrão por feature

```
features/people/
├── schemas.ts      # Zod (compartilhado entre form e action)
├── queries.ts      # leitura (Server Components)
├── actions.ts      # escrita (Server Actions)
└── components/     # PersonForm, PeopleTable, columns.tsx
```

### 5.2 Schema Zod (`schemas.ts`)

```ts
import { z } from "zod";

export const personSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  departmentId: z.string().min(1),
  positionId: z.string().min(1),
  managerId: z.string().nullable(),
  hiredAt: z.coerce.date(),
});
export type PersonInput = z.infer<typeof personSchema>;
```

### 5.3 Listagem com tabela server-side

- Paginação, ordenação e filtros **no servidor**, controlados por query string (`nuqs`)
- Colunas: avatar, nome, cargo, departamento, gestor, data de admissão, status
- Busca por nome/e-mail e filtro por departamento e status
- Export CSV do resultado filtrado (rota `api/export/people`)

### 5.4 Server Actions (`actions.ts`)

Em toda action, **nesta ordem**:
1. `getContext()` e checagem de permissão
2. Validação com Zod
3. Regras de negócio
4. Escrita (dentro de `$transaction` quando houver mais de uma tabela)
5. Registro de auditoria
6. `revalidatePath(...)`

Regras de negócio obrigatórias em Pessoas:
- **Sem ciclos na hierarquia:** ao definir `managerId`, suba a cadeia de gestores do candidato a gestor. Se encontrar a própria pessoa, rejeite.
- **Gestor deve ser da mesma organização** (o `tenantDb` já garante, mas valide a existência).
- **Mudança de cargo/departamento** fecha o `PersonAssignment` vigente (`endDate = hoje`) e abre outro (`startDate = hoje`), na mesma transação.
- **Desligamento**: preenche `terminatedAt`, fecha o assignment e **reatribui os subordinados** (exija escolher novo gestor).
- **Exclusão = soft delete** (`deletedAt`).

```ts
// Detecção de ciclo (esboço)
async function wouldCreateCycle(db: ReturnType<typeof tenantDb>, personId: string, newManagerId: string) {
  let current: string | null = newManagerId;
  while (current) {
    if (current === personId) return true;
    const m = await db.person.findFirst({ where: { id: current }, select: { managerId: true } });
    current = m?.managerId ?? null;
  }
  return false;
}
```

### 5.5 Formulário

React Hook Form + `zodResolver(personSchema)`, em `Dialog` ou página própria. Selects de departamento/cargo/gestor com busca (combobox do shadcn).

### 5.6 Departamentos e Cargos

Mesmo padrão. Departamentos aceitam `parentId` (árvore). Impeça excluir departamento com pessoas ativas.

✅ **Checkpoint:** criar, editar, transferir e desligar uma pessoa, e conferir o histórico no Prisma Studio.

---

## Fase 6: Organograma

### 6.1 Buscar os dados

Para a árvore inteira, uma consulta simples basta:

```ts
const people = await db.person.findMany({
  where: { deletedAt: null, terminatedAt: null },
  select: { id: true, name: true, managerId: true, avatarUrl: true /* + cargo/depto atual */ },
});
```

Para a subárvore de um gestor (visão "meu time"), use SQL recursivo:

```ts
const rows = await prisma.$queryRaw<{ id: string; name: string; managerId: string | null; depth: number }[]>`
  WITH RECURSIVE tree AS (
    SELECT id, name, "managerId", 0 AS depth
    FROM "Person"
    WHERE id = ${rootId} AND "organizationId" = ${orgId} AND "deletedAt" IS NULL
    UNION ALL
    SELECT p.id, p.name, p."managerId", t.depth + 1
    FROM "Person" p
    JOIN tree t ON p."managerId" = t.id
    WHERE p."organizationId" = ${orgId} AND p."deletedAt" IS NULL
  )
  SELECT * FROM tree
`;
```

### 6.2 Transformar em nós e arestas (`build-tree.ts`)

```ts
export function buildGraph(people: { id: string; managerId: string | null }[]) {
  const nodes = people.map((p) => ({ id: p.id, type: "person", data: p, position: { x: 0, y: 0 } }));
  const edges = people
    .filter((p) => p.managerId)
    .map((p) => ({ id: `${p.managerId}-${p.id}`, source: p.managerId!, target: p.id }));
  return { nodes, edges };
}
```

### 6.3 Layout automático (`layout.ts`)

Use `@dagrejs/dagre` com `rankdir: "TB"`, largura/altura fixas por nó (ex.: 220x90) e `nodesep`/`ranksep` generosos. Aplique as posições calculadas aos nós antes de renderizar.

### 6.4 Componente

- `ReactFlow` com `nodeTypes={{ person: PersonNode }}` (card com avatar, nome, cargo, contagem de subordinados)
- `Controls`, `MiniMap`, `Background`
- Marque `nodesDraggable={false}` no início (visualização). Edição por arrastar vem depois
- **Colapsar/expandir:** guarde no estado quais gestores estão colapsados e filtre os descendentes. Comece **colapsado a partir do nível 2 ou 3**
- Clique no nó abre um `Sheet` lateral com detalhes da pessoa
- Busca: digitar um nome centraliza (`fitView`/`setCenter`) e destaca o nó
- Filtro por departamento (destaca ou esconde o resto)
- Export como imagem/PDF (opcional, com `html-to-image`)

### 6.5 Performance

- Memoize `PersonNode` com `React.memo`
- Recalcule o layout apenas quando a lista de nós visíveis mudar
- Com mais de ~500 nós visíveis, force o colapso e carregue filhos sob demanda

✅ **Checkpoint:** organograma da seed com 300+ pessoas abre rápido, colapsa/expande e a busca funciona.

---

## Fase 7: Métricas e dashboard

### 7.1 Definir métricas (catálogo)

Crie `features/metrics/definitions.ts` com cada métrica e sua definição exata:

| key | Definição |
|---|---|
| `headcount` | Pessoas com assignment vigente na data |
| `hires` | Pessoas com `hiredAt` no dia |
| `terminations` | Pessoas com `terminatedAt` no dia |
| `turnover_30d` | Desligamentos em 30 dias / headcount médio |

Definição escrita evita discussão de "esse número está errado" depois.

### 7.2 Job de snapshot (Inngest)

```ts
// src/inngest/client.ts
import { Inngest } from "inngest";
export const inngest = new Inngest({ id: "dashboard-admin" });
```

```ts
// src/inngest/functions/daily-snapshot.ts
import { inngest } from "../client";
import { prisma } from "@/lib/db";
import { computeSnapshots } from "@/features/metrics/snapshots";

export const dailySnapshot = inngest.createFunction(
  { id: "daily-snapshot" },
  { cron: "0 3 * * *" }, // sintaxe da v3; confira a da sua versão
  async ({ step }) => {
    const orgs = await step.run("list-orgs", () => prisma.organization.findMany({ select: { id: true } }));
    for (const org of orgs) {
      await step.run(`snapshot-${org.id}`, () => computeSnapshots(org.id, new Date()));
    }
  }
);
```

```ts
// src/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { dailySnapshot } from "@/inngest/functions/daily-snapshot";

export const { GET, POST, PUT } = serve({ client: inngest, functions: [dailySnapshot] });
```

### 7.3 Cálculo (`snapshots.ts`)

Headcount por departamento em uma data:

```sql
SELECT "departmentId", COUNT(*)::int AS total
FROM "PersonAssignment"
WHERE "organizationId" = $1
  AND "startDate" <= $2
  AND ("endDate" IS NULL OR "endDate" > $2)
GROUP BY "departmentId"
```

Grave com `upsert` na chave `(organizationId, date, key, dimension)`. Assim o job é **idempotente** (rodar duas vezes não duplica).

Crie também uma função de **backfill** que percorre as datas passadas e recalcula tudo. Execute uma vez após o seed e sempre que mudar uma definição.

### 7.4 Leitura no dashboard (`queries.ts`)

Só lê `MetricSnapshot`, nunca calcula na hora. Funções como:
- `getKpis(period)`: valor atual, valor no período anterior e variação %
- `getSeries(key, from, to, dimension)`: série temporal para gráfico

### 7.5 Componentes de UI

- `KpiCard`: valor grande, variação com seta (verde/vermelho), mini sparkline
- Gráfico de **linha**: evolução do headcount
- Gráfico de **barras**: headcount por departamento
- Gráfico de **barras empilhadas ou combo**: admissões vs. desligamentos por mês
- Gráfico de **rosca/pizza**: distribuição por nível (use com moderação)
- Seletor de período (7d, 30d, 90d, 12m, personalizado) guardado na **URL**
- Estados de loading (`Skeleton`), vazio e erro

### 7.6 Página inicial

Linha de 4 KPIs no topo, 2 gráficos grandes abaixo e uma tabela "atividade recente" (vinda do `AuditLog`).

✅ **Checkpoint:** os números do dashboard batem com uma contagem manual no banco para 3 datas diferentes.

---

## Fase 8: Auditoria e permissões

### 8.1 Auditoria (`src/lib/audit.ts`)

```ts
export async function audit(
  db: ReturnType<typeof tenantDb>,
  ctx: { userId: string },
  p: { action: string; entity: string; entityId: string; before?: unknown; after?: unknown }
) {
  await db.auditLog.create({
    data: { actorId: ctx.userId, action: p.action, entity: p.entity, entityId: p.entityId, before: p.before as any, after: p.after as any } as any,
  });
}
```

- Chame em **toda** action de escrita
- Nunca grave campos sensíveis em `before`/`after` sem necessidade
- Página `audit-log` com filtros por entidade, ator e período

### 8.2 Permissões (`src/lib/permissions.ts`)

Matriz simples de papéis para ações:

```ts
const MATRIX = {
  "org:admin":   ["people:read","people:write","dept:write","audit:read","reports:write","settings:write"],
  "org:manager": ["people:read","people:write:team","reports:read"],
  "org:member":  ["people:read"],
} as const;

export function can(role: string, perm: string) {
  return (MATRIX as Record<string, readonly string[]>)[role]?.includes(perm) ?? false;
}

export function assertCan(role: string, perm: string) {
  if (!can(role, perm)) throw new Error("FORBIDDEN");
}
```

- Chame `assertCan` no início de **cada** Server Action e rota de API
- Gestores só editam pessoas da própria subárvore (reaproveite a query recursiva)
- Dados sensíveis (salário etc., se existirem) ficam em tabela própria com permissão dedicada

✅ **Checkpoint:** com um usuário `member`, tentar chamar uma action de escrita retorna erro mesmo burlando a UI.

---

## Fase 9: Relatórios e export

1. **CSV**: rota `api/export/[type]` com streaming para listas grandes, respeitando filtros e permissão
2. **PDF** (opcional): gere a partir de uma página HTML renderizada ou use uma lib de PDF no servidor
3. **Relatório agendado** com Inngest: função com cron semanal ou mensal que monta o resumo (KPIs + variação) e envia por e-mail (Resend ou similar)
4. Tela `reports` para configurar destinatários e frequência (modelo `ReportSchedule` no Prisma)

---

## Fase 10: Qualidade, deploy e observabilidade

### 10.1 Testes (o mínimo que vale a pena)

- **Vitest** para: detecção de ciclo, regras de assignment, cálculo de métricas, matriz de permissões
- **Teste de isolamento de tenant**: crie dados na org A e garanta que consultas na org B retornem vazio. Este é o teste mais importante do projeto
- **Playwright** para 2 ou 3 fluxos críticos (login, criar pessoa, ver organograma)

### 10.2 CI

GitHub Actions: `lint`, `tsc --noEmit`, `vitest` e `prisma validate` a cada PR.

### 10.3 Deploy na Vercel

1. Importar o repositório
2. Cadastrar as variáveis de ambiente (produção e preview)
3. Adicionar `prisma generate` ao build (ou em `postinstall`)
4. Rodar migrations em produção com `prisma migrate deploy` (etapa de CI/CD, não no build da Vercel)
5. Registrar o app no Inngest apontando para `https://seu-dominio/api/inngest`
6. Atualizar a URL do webhook do Clerk para produção
7. (Opcional) Integração Neon + Vercel para criar **um branch de banco por preview deploy**

### 10.4 Observabilidade e segurança

- Sentry (erros) e logs estruturados nas actions e nos jobs
- Headers de segurança e rate limit em rotas de export
- Backup: confirme a janela de restauração (point-in-time) do plano do Neon
- Revisar toda `$queryRaw` procurando `organizationId`

---

## Checklist final antes do lançamento

- [ ] Isolamento entre organizações testado automaticamente
- [ ] Todas as actions têm: `assertCan`, validação Zod e auditoria
- [ ] Organograma testado com volume realista
- [ ] Números do dashboard conferidos contra consultas manuais
- [ ] Jobs idempotentes e com backfill documentado
- [ ] Variáveis de ambiente de produção e webhooks configurados
- [ ] Estados de loading, vazio e erro em todas as telas
- [ ] Responsivo (mobile) nas telas principais
- [ ] README com setup, scripts e decisões de arquitetura

---

## Roadmap pós-MVP (só com demanda real)

1. Filtros comparativos (período vs. período anterior) em todos os gráficos
2. Metas/OKRs ligados a times
3. Dashboards customizáveis (widgets arrastáveis)
4. Módulos: ausências/férias, avaliações, ativos
5. Integrações: Slack, Google Workspace
6. Edição do organograma por arrastar e soltar (com confirmação e auditoria)
7. Campos customizáveis em pessoas via `JSONB` + Zod

---

## Ordem de trabalho resumida

```
Schema + seed → Auth/tenant → Shell → CRUD Pessoas → Organograma
→ Snapshots + KPIs → Auditoria/RBAC → Relatórios → Testes + Deploy
```

O organograma logo depois do CRUD de pessoas é intencional: ele valida o modelo de hierarquia cedo e é a entrega mais visível para mostrar progresso.
