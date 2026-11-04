"use client";

import { CircleAlert, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SectionContext, UiState } from "@/types/ui-state";

const labels = {
  kpis: { loading: "Carregando indicadores", empty: "Nenhum indicador disponível", detail: "Não há indicadores para apresentar neste contexto.", error: "Não foi possível exibir os indicadores" },
  admissions: { loading: "Carregando admissões mensais", empty: "Nenhuma admissão para apresentar", detail: "Não há registros na série de admissões deste período.", error: "Não foi possível exibir as admissões" },
  departments: { loading: "Carregando distribuição por departamento", empty: "Nenhum departamento para apresentar", detail: "Não há departamentos nesta distribuição.", error: "Não foi possível exibir a distribuição por departamento" },
  status: { loading: "Carregando situação dos colaboradores", empty: "Nenhuma situação para apresentar", detail: "Não há dados de situação dos colaboradores neste contexto.", error: "Não foi possível exibir a situação dos colaboradores" },
} as const;

function KpiSkeletons() {
  return (
    <div aria-hidden="true" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => <Card key={index} className="min-h-56 gap-5 bg-white p-5 shadow-none ring-slate-200">
        <div className="flex items-center justify-between gap-3"><Skeleton className="h-4 w-2/3 motion-reduce:animate-none" /><Skeleton className="size-9 shrink-0 motion-reduce:animate-none" /></div>
        <Skeleton className="h-9 w-24 motion-reduce:animate-none" />
        <Skeleton className="h-8 w-full motion-reduce:animate-none" />
        <Skeleton className="h-5 w-24 motion-reduce:animate-none" />
      </Card>)}
    </div>
  );
}

export function SectionFeedback({ status, context, onRetry }: { status: Exclude<UiState<unknown>["status"], "success">; context: SectionContext; onRetry?: () => void }) {
  const text = labels[context];
  if (status === "loading") {
    return <div role="status" aria-label={text.loading} aria-busy="true" className="min-w-0">
      <p className="sr-only">{text.loading}.</p>
      {context === "kpis" ? <KpiSkeletons /> : <div aria-hidden="true" className="space-y-5">
        <Skeleton className={`${context === "departments" ? "h-[28rem]" : "h-64"} w-full motion-reduce:animate-none`} />
        <Skeleton className="h-20 w-full motion-reduce:animate-none" />
      </div>}
    </div>;
  }
  const error = status === "error";
  const Icon = error ? CircleAlert : Inbox;
  return (
    <div role={error ? "alert" : "status"} className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center">
      <Icon className="size-6 text-slate-500" aria-hidden="true" />
      <h3 className="text-base font-semibold text-slate-900">{error ? text.error : text.empty}</h3>
      <p className="max-w-md text-sm leading-6 text-slate-600">{error ? "Os dados desta seção estão indisponíveis. As demais seções continuam disponíveis." : text.detail}</p>
      {error && onRetry && <Button onClick={onRetry} variant="outline" className="min-h-11 focus-visible:ring-indigo-600">Tentar novamente</Button>}
    </div>
  );
}
