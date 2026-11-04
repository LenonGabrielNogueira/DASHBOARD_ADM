import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DemonstrativeSource } from "@/types/analytics";
import type { SectionContext, UiState } from "@/types/ui-state";
import { SectionFeedback } from "@/components/states/section-feedback";
import { SectionErrorBoundary } from "@/components/states/section-error-boundary";

interface ChartContainerProps {
  id: string;
  title: string;
  description: string;
  source: DemonstrativeSource;
  summary: ReactNode;
  children: ReactNode;
  status?: UiState<unknown>["status"];
  context?: SectionContext;
}

export function ChartContainer({ id, title, description, source, summary, children, status = "success", context = "admissions" }: ChartContainerProps) {
  return (
    <Card role="region" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} className="min-w-0 bg-white py-5 shadow-none ring-slate-200">
      <CardHeader className="gap-3 px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id={`${id}-title`} className="text-base font-semibold text-slate-900">{title}</h2>
          {source.kind === "demonstration" && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">{source.label}</span>}
        </div>
        <p id={`${id}-description`} className="text-sm leading-6 text-slate-500">{description}</p>
        <p className="text-xs text-slate-500">{source.referenceLabel}</p>
      </CardHeader>
      <CardContent className="min-w-0 space-y-5 px-5 [&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:outline-offset-2 [&_.recharts-surface:focus-visible]:outline-indigo-600">
        <SectionErrorBoundary key={status} context={context}>
          {status === "success" ? <>
            {children}
            <div role="group" aria-label={`Resumo textual: ${title}`} className="space-y-3 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-600">
              <p className="font-medium text-slate-800">Leitura dos dados demonstrativos</p>
              {summary}
            </div>
          </> : <SectionFeedback context={context} status={status} />}
        </SectionErrorBoundary>
      </CardContent>
    </Card>
  );
}
