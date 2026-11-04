import { PageHeader } from "@/components/layout/page-header";
import type { AnalyticsData } from "@/types/analytics";
import { AdmissionsChart } from "./admissions-chart";
import { DepartmentChart } from "./department-chart";
import { StatusChart } from "./status-chart";

export function AnalyticsOverview({ data }: { data: AnalyticsData }) {
  return (
    <>
      <PageHeader title="Analytics" description="Explore os indicadores e acompanhe a evolução da organização." />
      <aside aria-label="Dados demonstrativos" className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm leading-6 text-indigo-950">
        <p className="font-semibold">Dados demonstrativos</p>
        <p className="mt-1 text-slate-600">Visualizações com valores fictícios, coerentes com os KPIs de demonstração. Nenhum dado real está sendo consultado.</p>
      </aside>
      <AdmissionsChart data={data.admissions} source={data.source} />
      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-2">
        <DepartmentChart data={data.departments} source={data.source} />
        <StatusChart data={data.statuses} source={data.source} />
      </div>
    </>
  );
}
