"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DemonstrativeSource, MonthlyAdmission } from "@/types/analytics";
import { ChartContainer } from "./chart-container";

export function AdmissionsChart({ data, source }: { data: readonly MonthlyAdmission[]; source: DemonstrativeSource }) {
  return (
    <ChartContainer id="admissions" title="Admissões mensais" description="Admissões fictícias de maio a outubro de 2026. Outubro corresponde às 32 admissões do KPI demonstrativo." source={source}
      summary={<dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 xl:grid-cols-6">{data.map((item) => <div key={item.month}><dt>{item.label}</dt><dd className="font-semibold text-slate-900">{item.admissions.toLocaleString("pt-BR")} admissões</dd></div>)}</dl>}>
      <div className="h-64 min-w-0 text-xs" aria-label="Linha de admissões mensais">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={[...data]} margin={{ top: 15, right: 15, bottom: 5, left: -20 }} accessibilityLayer>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={8} />
            <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [Number(value).toLocaleString("pt-BR"), "Admissões"]} />
            <Line name="Admissões" type="linear" dataKey="admissions" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500">Linha e pontos: número de admissões em cada mês.</p>
    </ChartContainer>
  );
}
