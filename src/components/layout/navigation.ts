import { Building2, ChartNoAxesCombined, FileText, LayoutDashboard, Users } from "lucide-react";

export const navigation = [
  { href: "/dashboard", title: "Dashboard", description: "Uma visão geral da sua organização, reunida em um só lugar.", icon: LayoutDashboard },
  { href: "/analytics", title: "Analytics", description: "Explore os indicadores e acompanhe a evolução da organização.", icon: ChartNoAxesCombined },
  { href: "/pessoas", title: "Pessoas", description: "Organize as informações das pessoas e seus vínculos com a organização.", icon: Users },
  { href: "/departamentos", title: "Departamentos", description: "Consulte os departamentos que compõem a estrutura organizacional.", icon: Building2 },
  { href: "/relatorios", title: "Relatórios", description: "Reúna as informações da organização em relatórios claros e objetivos.", icon: FileText },
] as const;

export type ModulePath = (typeof navigation)[number]["href"];

export function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
