import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { demoIndicators } from "@/lib/demo/dashboard";
import type { KpiIndicator } from "@/types/dashboard";

describe("DashboardOverview", () => {
  it("apresenta os quatro indicadores com valores pt-BR e origem demonstrativa explícita", () => {
    render(<DashboardOverview indicators={demoIndicators} />);
    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
    expect(screen.getByRole("complementary", { name: "Dados demonstrativos" })).toHaveTextContent("Valores fictícios");
    const list = screen.getByRole("list", { name: "Indicadores administrativos" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(4);
    for (const [title, value] of [["Total de colaboradores", "1.248"], ["Colaboradores ativos", "1.176"], ["Total de departamentos", "12"], ["Admissões no período", "32"]]) {
      const card = screen.getByRole("article", { name: title });
      expect(within(card).getByRole("heading", { name: title })).toBeVisible();
      expect(within(card).getByText(value, { exact: true })).toBeVisible();
      expect(within(card).getByText("Demonstração")).toBeVisible();
    }
    expect(screen.getByText(/01\/10\/2026 a 31\/10\/2026/)).toBeVisible();
  });

  it("reflete propriedades diferentes, distinguindo zero de valor indisponível", () => {
    const indicators: readonly KpiIndicator[] = [
      { ...demoIndicators[0], title: "Total de exemplo", value: null, description: "Valor não fornecido." },
      { ...demoIndicators[1], value: 0 },
    ];
    render(<DashboardOverview indicators={indicators} />);
    expect(screen.getAllByRole("article")).toHaveLength(2);
    const unavailable = screen.getByRole("article", { name: "Total de exemplo" });
    expect(within(unavailable).getByText("Indisponível")).toBeVisible();
    expect(within(unavailable).getByText("Valor não fornecido.")).toBeVisible();
    expect(within(screen.getByRole("article", { name: "Colaboradores ativos" })).getByText("0", { exact: true })).toBeVisible();
    expect(screen.queryByText("1.248")).not.toBeInTheDocument();
  });
});

describe("KpiCard", () => {
  it("formata o valor recebido sem números de demonstração fixos no componente", () => {
    render(<KpiCard indicator={{ ...demoIndicators[0], value: 9876543 }} />);
    expect(screen.getByText("9.876.543")).toBeVisible();
    expect(screen.queryByText("1.248")).not.toBeInTheDocument();
  });

  it.each([NaN, Infinity, -Infinity])("trata valor não finito %s como indisponível", (value) => {
    render(<KpiCard indicator={{ ...demoIndicators[0], value }} />);
    expect(screen.getByText("Indisponível")).toBeVisible();
  });
});
