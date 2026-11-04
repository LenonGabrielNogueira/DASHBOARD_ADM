import { Building2, UserPlus, Users, UserRoundCheck, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { KpiIcon, KpiIndicator } from "@/types/dashboard";

const icons = {
  people: Users,
  "active-people": UserRoundCheck,
  departments: Building2,
  admissions: UserPlus,
} satisfies Record<KpiIcon, LucideIcon>;

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function KpiCard({ indicator }: { indicator: KpiIndicator }) {
  const Icon = icons[indicator.icon];
  const available = indicator.value !== null && Number.isFinite(indicator.value);

  return (
    <Card role="article" aria-label={indicator.title} className="min-w-0 bg-white py-5 shadow-none ring-slate-200">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-5">
        <h3 className="min-w-0 text-sm leading-6 font-medium break-words text-slate-600">{indicator.title}</h3>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 px-5">
        <p className={available ? "text-3xl font-semibold tracking-tight break-all text-slate-950 tabular-nums" : "text-lg font-medium text-slate-500"}>
          {available ? numberFormatter.format(indicator.value!) : "Indisponível"}
        </p>
        <p className="text-xs leading-5 break-words text-slate-500">{indicator.description}</p>
        {indicator.source === "demonstration" && <span className="mt-auto w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">Demonstração</span>}
      </CardContent>
    </Card>
  );
}
