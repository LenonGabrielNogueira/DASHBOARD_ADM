import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div lang="pt-BR" className="min-h-dvh bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <a href="#conteudo-principal" className="sr-only fixed top-3 left-3 z-[60] rounded-lg bg-white px-4 py-3 text-sm text-slate-950 shadow focus:not-sr-only">Ir para o conteúdo</a>
      <aside aria-label="Menu administrativo" className="sticky top-0 hidden h-dvh lg:block">
        <AppSidebar />
      </aside>
      <div className="min-w-0">
        <AppHeader />
        <main id="conteudo-principal" tabIndex={-1} className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 outline-none sm:px-8 sm:py-10 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
