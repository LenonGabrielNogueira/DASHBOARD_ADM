import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const metadata: Metadata = {
  title: { default: "Dashboard ADM", template: "%s | Dashboard ADM" },
  description: "Dashboard administrativo organizacional. Interface em desenvolvimento.",
};

export default function AdministrativeLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
