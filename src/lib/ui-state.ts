import type { CollectionInput, CollectionState } from "@/types/ui-state";

export function collectionState<T>(data: readonly T[]): CollectionState<T> {
  if (data.length === 0) return { status: "empty" };
  // A checagem de tamanho garante que sucesso contém pelo menos um elemento.
  return { status: "success", data: data as readonly [T, ...T[]] };
}

export function resolveCollection<T>(input: CollectionInput<T>): CollectionState<T> {
  return input.state === undefined ? collectionState(input.data) : input.state;
}
