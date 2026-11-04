import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-3">
        <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase">Painel administrativo</p>
        <h1 className="text-3xl font-semibold tracking-tight break-words text-slate-950 sm:text-4xl">{title}</h1>
        {description && <p className="max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
