import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "./page-header";
import { navigation, type ModulePath } from "./navigation";

export function ModulePlaceholder({ href }: { href: ModulePath }) {
  const currentModule = navigation.find((item) => item.href === href)!;
  return (
    <>
      <PageHeader title={currentModule.title} description={currentModule.description} />
      <Card className="bg-white py-0 shadow-none ring-slate-200">
        <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 py-14 text-center sm:min-h-96">
          <span className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">
            <Construction className="size-7" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p className="mb-3 text-[11px] font-semibold tracking-widest text-indigo-600 uppercase">Próximas etapas</p>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Módulo em desenvolvimento</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Estamos preparando este espaço. As funcionalidades de {currentModule.title} serão disponibilizadas nas próximas etapas do projeto.</p>
          <p className="mt-6 rounded-full bg-slate-50 px-4 py-2 text-xs text-slate-500">Nenhum dado está sendo exibido ou consultado.</p>
        </CardContent>
      </Card>
    </>
  );
}
