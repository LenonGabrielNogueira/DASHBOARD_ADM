export type KpiId = "total-people" | "active-people" | "total-departments" | "period-hires";

export type KpiIcon = "people" | "active-people" | "departments" | "admissions";

export interface KpiIndicator {
  readonly id: KpiId;
  readonly title: string;
  readonly value: number | null;
  readonly description: string;
  readonly source: "demonstration";
  readonly icon: KpiIcon;
}
