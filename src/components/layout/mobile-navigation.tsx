"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "./app-sidebar";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="icon-lg" className="size-11 lg:hidden" aria-label="Abrir menu de navegação" />}>
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" showCloseButton={false} className="gap-0 border-slate-800 bg-slate-950 p-0 text-slate-100 data-[side=left]:w-[min(20rem,90vw)]">
        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
        <SheetDescription className="sr-only">Acesse os cinco módulos do Dashboard ADM.</SheetDescription>
        <SheetClose render={<Button variant="ghost" size="icon-lg" className="absolute top-3 right-3 size-11 text-slate-300 hover:bg-slate-800 hover:text-white" aria-label="Fechar menu de navegação" />}>
          <X aria-hidden="true" />
        </SheetClose>
        <AppSidebar onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
