"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelsTopLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { isActiveRoute, navigation } from "./navigation";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-950 text-slate-100">
      <div className="flex min-h-24 items-center gap-3 px-6 pr-14">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
          <PanelsTopLeft className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="whitespace-nowrap text-sm font-semibold tracking-tight">Dashboard ADM</p>
          <p className="mt-1 text-xs text-slate-400">Gestão organizacional</p>
        </div>
      </div>
      <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-3 text-[11px] font-medium tracking-widest text-slate-400 uppercase">Principal</p>
        <ul className="space-y-1.5">
          {navigation.map(({ href, title, icon: Icon }) => {
            const active = isActiveRoute(pathname, href);
            return (
              <li key={href}>
                <Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined}
                  className={cn("flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-300",
                    active ? "bg-indigo-500/15 font-medium text-indigo-200 ring-1 ring-indigo-400/20" : "text-slate-400 hover:bg-slate-800 hover:text-white")}>
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {title}
                  {active && <span className="ml-auto size-1.5 rounded-full bg-indigo-300" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mx-6 mb-6 border-t border-slate-800 pt-5">
        <p className="text-xs font-medium text-slate-300">Uma base para sua organização</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">Interface em desenvolvimento.<br />Os módulos serão disponibilizados por etapas.</p>
      </div>
    </div>
  );
}
