import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Departamentos" };

export default function DepartamentosPage() {
  return <ModulePlaceholder href="/departamentos" />;
}
