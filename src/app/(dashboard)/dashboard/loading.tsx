import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export default function DashboardLoading() {
  return <DashboardOverview state={{ status: "loading" }} />;
}
