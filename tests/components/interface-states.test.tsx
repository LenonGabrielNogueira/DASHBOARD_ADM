import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { AnalyticsOverview } from "@/components/charts/analytics-overview";
import { AdmissionsChart } from "@/components/charts/admissions-chart";
import { DepartmentChart } from "@/components/charts/department-chart";
import { StatusChart } from "@/components/charts/status-chart";
import { SectionErrorBoundary } from "@/components/states/section-error-boundary";
import { SectionFeedback } from "@/components/states/section-feedback";
import DashboardLoading from "@/app/(dashboard)/dashboard/loading";
import AnalyticsLoading from "@/app/(dashboard)/analytics/loading";
import { demoIndicators } from "@/lib/demo/dashboard";
import { demoAnalytics } from "@/lib/demo/analytics";
import type { SectionContext } from "@/types/ui-state";

describe("estados dos indicadores", () => {
  it("renderiza quatro skeletons acessíveis e depois preserva os dados disponíveis", () => {
    const { container, rerender } = render(<DashboardOverview state={{ status: "loading" }} />);
    expect(screen.getByRole("status", { name: "Carregando indicadores" })).toHaveAttribute("aria-busy", "true");
    expect(container.querySelectorAll('[data-slot="card"]')).toHaveLength(4);
    expect(screen.queryByText("1.248")).not.toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    rerender(<DashboardOverview indicators={demoIndicators} />);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getByText("1.248")).toBeVisible();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("distingue coleção vazia, erro e indicador indisponível", () => {
    const { rerender } = render(<DashboardOverview indicators={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("Nenhum indicador disponível");
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    expect(screen.queryByText("0", { exact: true })).not.toBeInTheDocument();
    rerender(<DashboardOverview state={{ status: "error" }} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível exibir os indicadores");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    rerender(<DashboardOverview indicators={[{ ...demoIndicators[0], value: null }]} />);
    expect(screen.getByText("Indisponível")).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("disponibiliza o loading de rota sem timers ou consultas", () => {
    render(<DashboardLoading />);
    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
    expect(screen.getByRole("status", { name: "Carregando indicadores" })).toBeInTheDocument();
  });
});

describe("estados dos gráficos por seção", () => {
  it("mantém os títulos e três skeletons no loading da rota Analytics", () => {
    const { container } = render(<AnalyticsLoading />);
    expect(screen.getAllByRole("status")).toHaveLength(3);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(3);
    expect(screen.queryByRole("group", { name: /Resumo textual/ })).not.toBeInTheDocument();
    expect(container.querySelector("svg.recharts-surface")).not.toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(6);
  });

  it("trata listas vazias de cada gráfico sem exibir números, legenda ou total substituto", () => {
    const { container } = render(<>
      <AdmissionsChart data={[]} source={demoAnalytics.source} />
      <DepartmentChart data={[]} source={demoAnalytics.source} />
      <StatusChart data={[]} source={demoAnalytics.source} />
    </>);
    expect(screen.getAllByRole("status")).toHaveLength(3);
    expect(screen.getByText("Nenhuma admissão para apresentar")).toBeVisible();
    expect(screen.getByText("Nenhum departamento para apresentar")).toBeVisible();
    expect(screen.getByText("Nenhuma situação para apresentar")).toBeVisible();
    expect(screen.queryByText(/Total demonstrativo:/)).not.toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Legenda da situação" })).not.toBeInTheDocument();
    expect(container.querySelector("svg.recharts-surface")).not.toBeInTheDocument();
  });

  it("isola erro, vazio e loading simultâneos, preservando o restante da página", () => {
    render(<AnalyticsOverview states={{ source: demoAnalytics.source, admissions: { status: "error" }, departments: { status: "empty" }, statuses: { status: "loading" } }} />);
    expect(screen.getByRole("heading", { level: 1, name: "Analytics" })).toBeVisible();
    const admissions = screen.getByRole("region", { name: "Admissões mensais" });
    expect(within(admissions).getByRole("alert")).toHaveTextContent("Não foi possível exibir as admissões");
    expect(within(admissions).queryByRole("button")).not.toBeInTheDocument();
    expect(within(screen.getByRole("region", { name: "Ativos por departamento" })).getByRole("status")).toHaveTextContent("Nenhum departamento");
    expect(screen.getByRole("status", { name: "Carregando situação dos colaboradores" })).toHaveAttribute("aria-busy", "true");
  });

  it.each(["kpis", "admissions", "departments", "status"] as const)("não oferece retry fictício no erro de dados de %s", (context: SectionContext) => {
    render(<SectionFeedback context={context} status="error" />);
    expect(screen.getByRole("alert")).toHaveTextContent("indisponíveis");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

it("captura falha real de renderização, oculta o detalhe técnico e permite tentar a seção novamente", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  let fail = true;
  function Content() {
    if (fail) throw new Error("detalhe-tecnico-interno");
    return <p>Seção recuperada</p>;
  }
  render(<><SectionErrorBoundary context="admissions"><Content /></SectionErrorBoundary><p>Outra seção disponível</p></>);
  expect(screen.getByRole("alert")).toBeVisible();
  expect(screen.queryByText(/detalhe-tecnico-interno/)).not.toBeInTheDocument();
  expect(screen.getByText("Outra seção disponível")).toBeVisible();
  fail = false;
  fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
  expect(screen.getByText("Seção recuperada")).toBeVisible();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
