import type { Metadata } from "next";
import { AnalyticsOverview } from "@/components/charts/analytics-overview";
import { demoAnalytics } from "@/lib/demo/analytics";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return <AnalyticsOverview data={demoAnalytics} />;
}
