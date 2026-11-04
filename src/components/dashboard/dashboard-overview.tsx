import { Info } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import type { KpiIndicator } from "@/types/dashboard";
import { KpiGrid } from "./kpi-grid";
import { collectionState } from "@/lib/ui-state";
import type { CollectionState } from "@/types/ui-state";
import { SectionFeedback } from "@/components/states/section-feedback";
import { SectionErrorBoundary } from "@/components/states/section-error-boundary";

type DashboardOverviewProps =
  | { indicators: readonly KpiIndicator[]; state?: never }
  | { indicators?: never; state: CollectionState<KpiIndicator> };

export function DashboardOverview(props: DashboardOverviewProps) {
  const state = props.state === undefined ? collectionState(props.indicators) : props.state;
  return (
    <>
      <PageHeader title="Dashboard" description="Uma visão geral da sua organização, reunida em um só lugar." />
      <aside aria-label="Dados demonstrativos" className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-indigo-950">
        <Info className="mt-0.5 size-5 shrink-0 text-indigo-600" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-semibold">Dados demonstrativos</p>
          <p className="text-sm leading-6 text-slate-600">Valores fictícios para apresentação da interface. Nenhum dado real está sendo consultado. Não utilize estes números para decisões administrativas.</p>
        </div>
      </aside>
      <section aria-labelledby="indicadores-titulo" className="space-y-4">
        <div className="space-y-1">
          <h2 id="indicadores-titulo" className="text-base font-semibold text-slate-900">Indicadores administrativos</h2>
          <p className="text-sm text-slate-500">Exemplos de indicadores atuais e admissões em um período demonstrativo fixo.</p>
        </div>
        <SectionErrorBoundary key={state.status} context="kpis">
          {state.status === "success" ? <KpiGrid indicators={state.data} /> : <SectionFeedback context="kpis" status={state.status} />}
        </SectionErrorBoundary>
      </section>
    </>
  );
}
