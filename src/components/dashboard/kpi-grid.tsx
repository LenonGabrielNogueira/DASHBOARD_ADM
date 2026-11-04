import type { KpiIndicator } from "@/types/dashboard";
import { KpiCard } from "./kpi-card";

export function KpiGrid({ indicators }: { indicators: readonly KpiIndicator[] }) {
  return (
    <ul aria-label="Indicadores administrativos" className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {indicators.map((indicator) => (
        <li key={indicator.id} className="grid min-w-0">
          <KpiCard indicator={indicator} />
        </li>
      ))}
    </ul>
  );
}
