import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppSidebar } from "@/components/layout/app-sidebar";

const route = vi.hoisted(() => ({ pathname: "/pessoas" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));

describe("AppSidebar", () => {
  it("apresenta os cinco módulos e identifica apenas a rota atual", () => {
    route.pathname = "/pessoas";
    render(<AppSidebar />);
    const nav = screen.getByRole("navigation", { name: "Navegação principal" });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(5);
    for (const [name, href] of [["Dashboard", "/dashboard"], ["Analytics", "/analytics"], ["Pessoas", "/pessoas"], ["Departamentos", "/departamentos"], ["Relatórios", "/relatorios"]]) {
      expect(within(nav).getByRole("link", { name })).toHaveAttribute("href", href);
    }
    expect(within(nav).getByRole("link", { name: "Pessoas" })).toHaveAttribute("aria-current", "page");
    expect(links.filter((link) => link.hasAttribute("aria-current"))).toHaveLength(1);
  });

  it("mantém o módulo ativo em subrotas sem aceitar prefixos de outros caminhos", () => {
    route.pathname = "/pessoas/registro";
    const { rerender } = render(<AppSidebar />);
    expect(screen.getByRole("link", { name: "Pessoas" })).toHaveAttribute("aria-current", "page");
    route.pathname = "/pessoas-arquivadas";
    rerender(<AppSidebar />);
    expect(screen.getAllByRole("link").some((link) => link.hasAttribute("aria-current"))).toBe(false);
  });
});
