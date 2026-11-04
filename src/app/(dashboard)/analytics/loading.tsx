import { AnalyticsOverview } from "@/components/charts/analytics-overview";
import { demoAnalytics } from "@/lib/demo/analytics";

export default function AnalyticsLoading() {
  return <AnalyticsOverview states={{ source: demoAnalytics.source, admissions: { status: "loading" }, departments: { status: "loading" }, statuses: { status: "loading" } }} />;
}
