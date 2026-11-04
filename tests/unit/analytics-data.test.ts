import { describe, expect, it } from "vitest";
import { demoAnalytics } from "@/lib/demo/analytics";
import { demoIndicators } from "@/lib/demo/dashboard";

describe("coerência das agregações demonstrativas de Analytics", () => {
  it("distribui exatamente os ativos do KPI em 12 departamentos distintos", () => {
    expect(demoAnalytics.departments).toHaveLength(demoIndicators.find((item) => item.id === "total-departments")!.value);
    expect(new Set(demoAnalytics.departments.map((item) => item.id)).size).toBe(12);
    expect(demoAnalytics.departments.reduce((sum, item) => sum + item.activePeople, 0)).toBe(demoIndicators.find((item) => item.id === "active-people")!.value);
    expect(demoAnalytics.departments.every((item) => Number.isInteger(item.activePeople) && item.activePeople >= 0)).toBe(true);
  });

  it("reconcilia ativos e desligados com o total, sem duplicar situações", () => {
    expect(demoAnalytics.statuses.map((item) => item.status)).toEqual(["active", "terminated"]);
    expect(demoAnalytics.statuses.find((item) => item.status === "active")!.people).toBe(demoIndicators.find((item) => item.id === "active-people")!.value);
    expect(demoAnalytics.statuses.find((item) => item.status === "terminated")!.people).toBe(72);
    expect(demoAnalytics.statuses.reduce((sum, item) => sum + item.people, 0)).toBe(demoIndicators.find((item) => item.id === "total-people")!.value);
  });

  it("mantém outubro coerente com o KPI e meses únicos em ordem cronológica", () => {
    expect(demoAnalytics.admissions.find((item) => item.month === "2026-10")!.admissions).toBe(demoIndicators.find((item) => item.id === "period-hires")!.value);
    const months = demoAnalytics.admissions.map((item) => item.month);
    expect(months).toEqual([...months].sort());
    expect(new Set(months).size).toBe(months.length);
    expect(demoAnalytics.admissions.every((item) => Number.isInteger(item.admissions) && item.admissions >= 0 && item.month <= "2026-10")).toBe(true);
    expect(demoAnalytics.source).toEqual({ kind: "demonstration", label: "Dados demonstrativos", referenceLabel: "Referência fictícia: 31/10/2026" });
  });
});
