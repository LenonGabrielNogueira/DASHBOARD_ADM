"use client";

import { usePathname } from "next/navigation";
import { MobileNavigation } from "./mobile-navigation";
import { isActiveRoute, navigation } from "./navigation";

export function AppHeader() {
  const pathname = usePathname();
  const current = navigation.find(({ href }) => isActiveRoute(pathname, href));

  return (
    <header className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <MobileNavigation />
        <div className="min-w-0">
          <p className="text-xs text-slate-500">Espaço administrativo</p>
          <p className="mt-1 truncate text-sm font-medium text-slate-900">{current?.title ?? "Dashboard ADM"}</p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2" aria-label="Área de ações da página">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">Em desenvolvimento</span>
      </div>
    </header>
  );
}
