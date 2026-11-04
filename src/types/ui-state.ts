export type UiState<T> =
  | { readonly status: "loading"; readonly data?: never }
  | { readonly status: "success"; readonly data: T }
  | { readonly status: "empty"; readonly data?: never }
  | { readonly status: "error"; readonly data?: never };

export type NonEmptyCollection<T> = readonly [T, ...T[]];
export type CollectionState<T> = UiState<NonEmptyCollection<T>>;
export type CollectionInput<T> =
  | { readonly data: readonly T[]; readonly state?: never }
  | { readonly data?: never; readonly state: CollectionState<T> };

export type SectionContext = "kpis" | "admissions" | "departments" | "status";
