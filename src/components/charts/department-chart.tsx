"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DemonstrativeSource, DepartmentDistribution } from "@/types/analytics";
import { ChartContainer } from "./chart-container";

export function DepartmentChart({ data, source }: { data: readonly DepartmentDistribution[]; source: DemonstrativeSource }) {
  return (
    <ChartContainer id="departments" title="Ativos por departamento" description="Distribuição fictícia de 1.176 colaboradores ativos nos 12 departamentos. Cada pessoa é representada uma única vez." source={source}
      summary={<dl className="grid gap-2 sm:grid-cols-2">{data.map((item) => <div key={item.id} className="min-w-0"><dt className="break-words">{item.name}</dt><dd className="font-semibold text-slate-900">{item.activePeople.toLocaleString("pt-BR")} ativos</dd></div>)}</dl>}>
      <div className="h-[28rem] min-w-0 text-xs" aria-label="Barras de colaboradores ativos por departamento">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={[...data]} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 0 }} accessibilityLayer>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="shortName" width={92} tick={{ fill: "#64748b", fontSize: 10 }} interval={0} axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => [Number(value).toLocaleString("pt-BR"), "Colaboradores ativos"]} />
            <Bar name="Colaboradores ativos" dataKey="activePeople" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={16} isAnimationActive={false}>
              <LabelList dataKey="activePeople" position="right" fill="#475569" fontSize={10} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500">Barras: quantidade de ativos. Nomes completos e valores estão na leitura abaixo.</p>
    </ChartContainer>
  );
}
