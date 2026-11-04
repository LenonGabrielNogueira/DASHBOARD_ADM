export interface DemonstrativeSource {
  readonly kind: "demonstration";
  readonly label: "Dados demonstrativos";
  readonly referenceLabel: string;
}

export interface MonthlyAdmission {
  readonly month: string;
  readonly label: string;
  readonly admissions: number;
}

export interface DepartmentDistribution {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly activePeople: number;
}

export interface PeopleStatus {
  readonly status: "active" | "terminated";
  readonly label: string;
  readonly people: number;
}

export interface AnalyticsData {
  readonly source: DemonstrativeSource;
  readonly admissions: readonly MonthlyAdmission[];
  readonly departments: readonly DepartmentDistribution[];
  readonly statuses: readonly PeopleStatus[];
}
