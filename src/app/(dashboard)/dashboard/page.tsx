import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <ModulePlaceholder href="/dashboard" />;
}
