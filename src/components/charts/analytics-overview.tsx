import { PageHeader } from "@/components/layout/page-header";
import type { AnalyticsData, AnalyticsSectionStates } from "@/types/analytics";
import { collectionState } from "@/lib/ui-state";
import { AdmissionsChart } from "./admissions-chart";
import { DepartmentChart } from "./department-chart";
import { StatusChart } from "./status-chart";

type AnalyticsOverviewProps =
  | { data: AnalyticsData; states?: never }
  | { data?: never; states: AnalyticsSectionStates };

export function AnalyticsOverview(props: AnalyticsOverviewProps) {
  const states: AnalyticsSectionStates = props.states === undefined ? {
    source: props.data.source,
    admissions: collectionState(props.data.admissions),
    departments: collectionState(props.data.departments),
    statuses: collectionState(props.data.statuses),
  } : props.states;
  return (
    <>
      <PageHeader title="Analytics" description="Explore os indicadores e acompanhe a evolução da organização." />
      <aside aria-label="Dados demonstrativos" className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm leading-6 text-indigo-950">
        <p className="font-semibold">Dados demonstrativos</p>
        <p className="mt-1 text-slate-600">Visualizações com valores fictícios, coerentes com os KPIs de demonstração. Nenhum dado real está sendo consultado.</p>
      </aside>
      <AdmissionsChart state={states.admissions} source={states.source} />
      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-2">
        <DepartmentChart state={states.departments} source={states.source} />
        <StatusChart state={states.statuses} source={states.source} />
      </div>
    </>
  );
}
