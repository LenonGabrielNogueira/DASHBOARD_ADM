import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { PageHeader } from "@/components/layout/page-header";

it("apresenta título, descrição e ações opcionais do cabeçalho", () => {
  const { rerender } = render(<PageHeader title="Pessoas" description="Descrição do módulo" actions={<button>Ação futura</button>} />);
  expect(screen.getByRole("heading", { level: 1, name: "Pessoas" })).toBeVisible();
  expect(screen.getByText("Descrição do módulo")).toBeVisible();
  expect(screen.getByRole("button", { name: "Ação futura" })).toBeVisible();
  rerender(<PageHeader title="Dashboard" />);
  expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(screen.queryByText("Descrição do módulo")).not.toBeInTheDocument();
});
