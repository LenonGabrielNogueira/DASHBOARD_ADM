"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DemonstrativeSource, PeopleStatus } from "@/types/analytics";
import { ChartContainer } from "./chart-container";

const colors = { active: "#4f46e5", terminated: "#94a3b8" } as const;

export function StatusChart({ data, source }: { data: readonly PeopleStatus[]; source: DemonstrativeSource }) {
  const total = data.reduce((sum, item) => sum + item.people, 0);
  return (
    <ChartContainer id="status" title="Situação dos colaboradores" description="Composição fictícia dos 1.248 colaboradores: ativos e desligados. Não representa evolução histórica." source={source}
      summary={<><p>Total demonstrativo: <strong>{total.toLocaleString("pt-BR")} colaboradores.</strong></p><dl className="grid grid-cols-2 gap-4">{data.map((item) => <div key={item.status}><dt>{item.label}</dt><dd className="font-semibold text-slate-900">{item.people.toLocaleString("pt-BR")} colaboradores</dd></div>)}</dl></>}>
      <div className="h-64 min-w-0 text-xs" aria-label="Rosca da situação dos colaboradores">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart accessibilityLayer>
            <Pie data={[...data]} dataKey="people" nameKey="label" innerRadius="58%" outerRadius="82%" paddingAngle={2} stroke="#fff" strokeWidth={3} isAnimationActive={false}>
              {data.map((item) => <Cell key={item.status} fill={colors[item.status]} />)}
            </Pie>
            <Tooltip formatter={(value) => [Number(value).toLocaleString("pt-BR"), "Colaboradores"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul aria-label="Legenda da situação" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-600">
        {data.map((item) => <li key={item.status} className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ backgroundColor: colors[item.status] }} aria-hidden="true" />{item.label}: {item.people.toLocaleString("pt-BR")}</li>)}
      </ul>
    </ChartContainer>
  );
}
