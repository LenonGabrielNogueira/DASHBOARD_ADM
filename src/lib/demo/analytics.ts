import type { AnalyticsData } from "@/types/analytics";

// Agregações fictícias fixas para apresentação. Não há histórico ou consulta real.
export const demoAnalytics = {
  source: { kind: "demonstration", label: "Dados demonstrativos", referenceLabel: "Referência fictícia: 31/10/2026" },
  admissions: [
    { month: "2026-05", label: "Mai/26", admissions: 24 },
    { month: "2026-06", label: "Jun/26", admissions: 28 },
    { month: "2026-07", label: "Jul/26", admissions: 36 },
    { month: "2026-08", label: "Ago/26", admissions: 25 },
    { month: "2026-09", label: "Set/26", admissions: 30 },
    { month: "2026-10", label: "Out/26", admissions: 32 },
  ],
  departments: [
    { id: "technology", name: "Tecnologia e desenvolvimento", shortName: "Tecnologia", activePeople: 180 },
    { id: "operations", name: "Operações", shortName: "Operações", activePeople: 160 },
    { id: "sales", name: "Comercial", shortName: "Comercial", activePeople: 140 },
    { id: "support", name: "Atendimento ao cliente", shortName: "Atendimento", activePeople: 128 },
    { id: "administration", name: "Administração", shortName: "Administração", activePeople: 112 },
    { id: "finance", name: "Financeiro", shortName: "Financeiro", activePeople: 104 },
    { id: "marketing", name: "Marketing", shortName: "Marketing", activePeople: 96 },
    { id: "people", name: "Recursos Humanos", shortName: "RH", activePeople: 80 },
    { id: "logistics", name: "Logística", shortName: "Logística", activePeople: 64 },
    { id: "legal", name: "Jurídico", shortName: "Jurídico", activePeople: 56 },
    { id: "purchasing", name: "Compras", shortName: "Compras", activePeople: 40 },
    { id: "communication", name: "Comunicação", shortName: "Comunicação", activePeople: 16 },
  ],
  statuses: [
    { status: "active", label: "Ativos", people: 1176 },
    { status: "terminated", label: "Desligados", people: 72 },
  ],
} as const satisfies AnalyticsData;
