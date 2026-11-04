import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { ChartContainer } from "@/components/charts/chart-container";
import { demoAnalytics } from "@/lib/demo/analytics";

it("associa título e descrição ao gráfico e mantém resumo textual e origem visíveis", () => {
  render(<ChartContainer id="test-chart" title="Admissões mensais" description="Admissões por mês no período demonstrativo." source={demoAnalytics.source} summary={<p>Out/26: 32 admissões.</p>}>
    <svg role="img" aria-label="Visualização de exemplo" />
  </ChartContainer>);
  const region = screen.getByRole("region", { name: "Admissões mensais" });
  expect(region).toHaveAccessibleDescription("Admissões por mês no período demonstrativo.");
  expect(within(region).getByRole("heading", { level: 2, name: "Admissões mensais" })).toBeVisible();
  expect(within(region).getByText("Dados demonstrativos")).toBeVisible();
  expect(within(region).getByText("Referência fictícia: 31/10/2026")).toBeVisible();
  expect(within(region).getByRole("img", { name: "Visualização de exemplo" })).toBeVisible();
  expect(within(region).getByRole("group", { name: "Resumo textual: Admissões mensais" })).toHaveTextContent("Out/26: 32 admissões.");
});

it("mantém descrições e nomes extensos como texto, sem depender de tooltip", () => {
  const title = "Colaboradores ativos por departamento da organização demonstrativa";
  render(<ChartContainer id="long-chart" title={title} description="Os nomes completos permanecem disponíveis na leitura textual." source={demoAnalytics.source} summary={<p>Tecnologia e desenvolvimento: 180 ativos.</p>}><span>Gráfico</span></ChartContainer>);
  expect(screen.getByRole("region", { name: title })).toHaveAccessibleDescription("Os nomes completos permanecem disponíveis na leitura textual.");
  expect(screen.getByText("Tecnologia e desenvolvimento: 180 ativos.")).toBeVisible();
});
