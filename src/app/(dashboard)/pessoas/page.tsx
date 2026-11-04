import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = { title: "Pessoas" };

export default function PessoasPage() {
  return <ModulePlaceholder href="/pessoas" />;
}
