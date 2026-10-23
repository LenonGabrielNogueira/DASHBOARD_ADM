/**
 * Seed realista para o dashboard organizacional.
 *
 * Gera (por padrão) ~300 pessoas em uma árvore de 5 níveis:
 *   CEO → Diretores → Gerentes → Coordenadores → Analistas/Estagiários
 * com ~6 anos de histórico: admissões, desligamentos (~12% da base operacional)
 * e promoções (PersonAssignment com vigência, sem sobreposição).
 *
 * Uso:
 *   npx prisma db seed
 *
 * Variáveis opcionais:
 *   SEED_PEOPLE=500            total de pessoas (padrão 300)
 *   SEED_CLERK_ORG_ID=org_xxx  vincula a org do seed a uma org real do Clerk
 *
 * É idempotente: apaga e recria apenas a organização identificada por SEED_CLERK_ORG_ID.
 * NUNCA rode contra um banco de produção com dados reais.
 */

import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/pt_BR";

const prisma = new PrismaClient();
faker.seed(42); // resultados reproduzíveis

// ─────────────────────────────────────────────
// Configuração
// ─────────────────────────────────────────────

const CLERK_ORG_ID = process.env.SEED_CLERK_ORG_ID ?? "org_seed_demo";
const ORG_NAME = "Empresa Demo";
const TARGET_PEOPLE = Number(process.env.SEED_PEOPLE ?? 300);
const TERMINATION_RATE = 0.12; // apenas na base operacional (sem subordinados)
const PROMOTION_RATE = 0.35;

const DEPARTMENTS = [
  { name: "Tecnologia", subs: ["Engenharia", "Produto", "Dados e Analytics"] },
  { name: "Comercial", subs: ["Vendas", "Pré-vendas", "Contas Estratégicas"] },
  { name: "Marketing", subs: ["Conteúdo", "Performance", "Branding"] },
  { name: "Financeiro", subs: ["Contabilidade", "Tesouraria", "Planejamento"] },
  { name: "Pessoas e Cultura", subs: ["Recrutamento", "Remuneração e Benefícios", "Desenvolvimento"] },
  { name: "Operações", subs: ["Logística", "Qualidade", "Suprimentos"] },
  { name: "Jurídico", subs: ["Contratos", "Compliance"] },
  { name: "Atendimento ao Cliente", subs: ["Suporte", "Sucesso do Cliente"] },
];

const EXEC_DEPARTMENT = "Diretoria Executiva";

const POSITIONS = [
  { title: "CEO", level: 0 },
  { title: "Diretor(a)", level: 1 },
  { title: "Gerente", level: 2 },
  { title: "Coordenador(a)", level: 3 },
  { title: "Analista Sênior", level: 4 },
  { title: "Analista Pleno", level: 5 },
  { title: "Analista Júnior", level: 6 },
  { title: "Estagiário(a)", level: 7 },
];

// Escada de carreira da base operacional (para promoções)
const LADDER = ["Estagiário(a)", "Analista Júnior", "Analista Pleno", "Analista Sênior"];

// ─────────────────────────────────────────────
// Utilidades
// ─────────────────────────────────────────────

const DAY = 86_400_000;
const NOW = new Date();

const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY);
const daysAgo = (n: number) => addDays(NOW, -n);
const atMidnight = (d: Date) => {
  const c = new Date(d);
  c.setUTCHours(0, 0, 0, 0);
  return c;
};

/** Data aleatória entre `from` e `NOW - toDaysAgo`. */
function dateBetween(from: Date, toDaysAgo: number): Date {
  const to = daysAgo(toDaysAgo);
  return atMidnight(faker.date.between({ from, to: to > from ? to : addDays(from, 1) }));
}

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "");

const usedEmails = new Set<string>();
function uniqueEmail(name: string): string {
  const base = slug(name);
  let email = `${base}@exemplo.com.br`;
  let n = 1;
  while (usedEmails.has(email)) email = `${base}.${++n}@exemplo.com.br`;
  usedEmails.add(email);
  return email;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ─────────────────────────────────────────────
// Tipos internos
// ─────────────────────────────────────────────

type SeedPerson = {
  id: string;
  name: string;
  email: string;
  managerId: string | null;
  hiredAt: Date;
  terminatedAt: Date | null;
  positionTitle: string;
  departmentId: string;
};

type SeedDept = { id: string; name: string; parentId: string | null };

// ─────────────────────────────────────────────
// Execução
// ─────────────────────────────────────────────

async function resetOrganization() {
  const existing = await prisma.organization.findUnique({ where: { clerkOrgId: CLERK_ORG_ID } });
  if (!existing) return;

  const organizationId = existing.id;
  await prisma.$transaction([
    prisma.auditLog.deleteMany({ where: { organizationId } }),
    prisma.metricSnapshot.deleteMany({ where: { organizationId } }),
    prisma.reportSchedule.deleteMany({ where: { organizationId } }),
    prisma.personAssignment.deleteMany({ where: { organizationId } }),
    prisma.person.deleteMany({ where: { organizationId } }),
    prisma.position.deleteMany({ where: { organizationId } }),
    prisma.department.deleteMany({ where: { organizationId } }),
    prisma.organization.delete({ where: { id: organizationId } }),
  ]);
}

async function main() {
  console.log(`🌱 Seed: ${TARGET_PEOPLE} pessoas na organização "${ORG_NAME}" (${CLERK_ORG_ID})`);

  await resetOrganization();

  const org = await prisma.organization.create({
    data: { clerkOrgId: CLERK_ORG_ID, name: ORG_NAME },
  });

  // ── Departamentos ───────────────────────────
  const depts: SeedDept[] = [];
  const execDept: SeedDept = { id: faker.string.uuid(), name: EXEC_DEPARTMENT, parentId: null };
  depts.push(execDept);

  const topDepts = DEPARTMENTS.map((d) => {
    const top: SeedDept = { id: faker.string.uuid(), name: d.name, parentId: null };
    depts.push(top);
    const subIds = d.subs.map((s) => {
      const sub: SeedDept = { id: faker.string.uuid(), name: s, parentId: top.id };
      depts.push(sub);
      return sub.id;
    });
    return { id: top.id, subIds };
  });

  // ── Cargos ──────────────────────────────────
  const positionIds = new Map<string, string>(POSITIONS.map((p) => [p.title, faker.string.uuid()]));
  const pos = (title: string) => positionIds.get(title)!;

  // ── Pessoas (hierarquia) ────────────────────
  const people: SeedPerson[] = [];

  function makePerson(p: {
    managerId: string | null;
    hiredAt: Date;
    positionTitle: string;
    departmentId: string;
    terminatedAt?: Date | null;
  }): SeedPerson {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const person: SeedPerson = {
      id: faker.string.uuid(),
      name,
      email: uniqueEmail(name),
      managerId: p.managerId,
      hiredAt: p.hiredAt,
      terminatedAt: p.terminatedAt ?? null,
      positionTitle: p.positionTitle,
      departmentId: p.departmentId,
    };
    people.push(person);
    return person;
  }

  // Nível 0: CEO
  const ceo = makePerson({
    managerId: null,
    hiredAt: atMidnight(daysAgo(6 * 365)),
    positionTitle: "CEO",
    departmentId: execDept.id,
  });

  // Nível 1: um diretor por departamento de topo
  const directors = topDepts.map((d) => ({
    person: makePerson({
      managerId: ceo.id,
      hiredAt: dateBetween(ceo.hiredAt, 730),
      positionTitle: "Diretor(a)",
      departmentId: d.id,
    }),
    subIds: d.subIds,
  }));

  // Nível 2: 2 a 3 gerentes por diretor, distribuídos entre os subdepartamentos
  const managers: SeedPerson[] = [];
  for (const dir of directors) {
    const n = faker.number.int({ min: 2, max: 3 });
    for (let i = 0; i < n; i++) {
      managers.push(
        makePerson({
          managerId: dir.person.id,
          hiredAt: dateBetween(dir.person.hiredAt, 365),
          positionTitle: "Gerente",
          departmentId: dir.subIds[i % dir.subIds.length],
        }),
      );
    }
  }

  // Nível 3: 2 a 3 coordenadores por gerente
  const coordinators: SeedPerson[] = [];
  for (const mgr of managers) {
    const n = faker.number.int({ min: 2, max: 3 });
    for (let i = 0; i < n; i++) {
      coordinators.push(
        makePerson({
          managerId: mgr.id,
          hiredAt: dateBetween(mgr.hiredAt, 180),
          positionTitle: "Coordenador(a)",
          departmentId: mgr.departmentId,
        }),
      );
    }
  }

  // Nível 4+: base operacional (preenche até o total desejado)
  const staffCount = Math.max(0, TARGET_PEOPLE - people.length);
  const shuffledCoords = faker.helpers.shuffle(coordinators);
  for (let i = 0; i < staffCount; i++) {
    const coord = shuffledCoords[i % shuffledCoords.length];
    const hiredAt = dateBetween(coord.hiredAt, 7);

    const terminatedAt =
      faker.datatype.boolean({ probability: TERMINATION_RATE }) && addDays(hiredAt, 90) < daysAgo(1)
        ? dateBetween(addDays(hiredAt, 90), 1)
        : null;

    makePerson({
      managerId: coord.id,
      hiredAt,
      terminatedAt,
      positionTitle: faker.helpers.weightedArrayElement([
        { weight: 10, value: "Estagiário(a)" },
        { weight: 30, value: "Analista Júnior" },
        { weight: 35, value: "Analista Pleno" },
        { weight: 25, value: "Analista Sênior" },
      ]),
      departmentId: coord.departmentId,
    });
  }

  // ── Assignments (histórico com vigência) ────
  const assignments: {
    id: string;
    organizationId: string;
    personId: string;
    departmentId: string;
    positionId: string;
    startDate: Date;
    endDate: Date | null;
  }[] = [];

  let promotions = 0;

  for (const p of people) {
    const end = p.terminatedAt; // null = vigente
    const tenureEnd = end ?? NOW;
    const tenureDays = (tenureEnd.getTime() - p.hiredAt.getTime()) / DAY;
    const ladderIdx = LADDER.indexOf(p.positionTitle);

    const promoted =
      ladderIdx > 0 && tenureDays > 365 && faker.datatype.boolean({ probability: PROMOTION_RATE });

    if (promoted) {
      promotions++;
      const changeDate = atMidnight(
        faker.date.between({ from: addDays(p.hiredAt, 180), to: addDays(tenureEnd, -90) }),
      );
      assignments.push(
        {
          id: faker.string.uuid(),
          organizationId: org.id,
          personId: p.id,
          departmentId: p.departmentId,
          positionId: pos(LADDER[ladderIdx - 1]),
          startDate: p.hiredAt,
          endDate: changeDate,
        },
        {
          id: faker.string.uuid(),
          organizationId: org.id,
          personId: p.id,
          departmentId: p.departmentId,
          positionId: pos(p.positionTitle),
          startDate: changeDate,
          endDate: end,
        },
      );
    } else {
      assignments.push({
        id: faker.string.uuid(),
        organizationId: org.id,
        personId: p.id,
        departmentId: p.departmentId,
        positionId: pos(p.positionTitle),
        startDate: p.hiredAt,
        endDate: end,
      });
    }
  }

  // ── Persistência (pais antes dos filhos) ────
  await prisma.department.createMany({
    data: [
      ...depts.filter((d) => d.parentId === null),
      ...depts.filter((d) => d.parentId !== null),
    ].map((d) => ({ ...d, organizationId: org.id })),
  });

  await prisma.position.createMany({
    data: POSITIONS.map((p) => ({ id: pos(p.title), organizationId: org.id, title: p.title, level: p.level })),
  });

  // `people` já está ordenada: CEO → diretores → gerentes → coordenadores → base
  for (const part of chunk(people, 500)) {
    await prisma.person.createMany({
      data: part.map((p) => ({
        id: p.id,
        organizationId: org.id,
        managerId: p.managerId,
        name: p.name,
        email: p.email,
        hiredAt: p.hiredAt,
        terminatedAt: p.terminatedAt,
      })),
    });
  }

  for (const part of chunk(assignments, 1000)) {
    await prisma.personAssignment.createMany({ data: part });
  }

  await prisma.reportSchedule.create({
    data: {
      organizationId: org.id,
      name: "Resumo mensal de headcount",
      type: "headcount_summary",
      frequency: "MONTHLY",
      recipients: ["rh@exemplo.com.br"],
      createdBy: "seed",
    },
  });

  // ── Resumo ──────────────────────────────────
  const terminated = people.filter((p) => p.terminatedAt).length;
  console.log("✅ Seed concluído");
  console.table({
    organização: org.name,
    departamentos: depts.length,
    cargos: POSITIONS.length,
    pessoas: people.length,
    ativas: people.length - terminated,
    desligadas: terminated,
    assignments: assignments.length,
    promoções: promotions,
  });
  console.log("➡️  Próximo passo: rodar o backfill de MetricSnapshot (Fase 7 do guia).");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());