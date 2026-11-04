import type { KpiIndicator } from "@/types/dashboard";

// Exemplos fixos para validar a interface. Não representam consultas ou cálculos reais.
export const demoIndicators = [
  {
    id: "total-people",
    title: "Total de colaboradores",
    value: 1248,
    description: "Exemplo de total atual, incluindo pessoas desligadas.",
    source: "demonstration",
    icon: "people",
  },
  {
    id: "active-people",
    title: "Colaboradores ativos",
    value: 1176,
    description: "Exemplo de pessoas com situação ativa na data de referência.",
    source: "demonstration",
    icon: "active-people",
  },
  {
    id: "total-departments",
    title: "Total de departamentos",
    value: 12,
    description: "Exemplo de departamentos não arquivados, inclusive vazios.",
    source: "demonstration",
    icon: "departments",
  },
  {
    id: "period-hires",
    title: "Admissões no período",
    value: 32,
    description: "Período demonstrativo: 01/10/2026 a 31/10/2026.",
    source: "demonstration",
    icon: "admissions",
  },
] as const satisfies readonly KpiIndicator[];
