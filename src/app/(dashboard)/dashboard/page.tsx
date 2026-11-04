import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { demoIndicators } from "@/lib/demo/dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DashboardOverview indicators={demoIndicators} />;
}
