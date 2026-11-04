import { describe, expect, expectTypeOf, it } from "vitest";
import { collectionState, resolveCollection } from "@/lib/ui-state";
import type { CollectionState, UiState } from "@/types/ui-state";

describe("contrato dos estados de seção", () => {
  it("representa ausência de registros sem inventar valores", () => {
    expect(collectionState([])).toEqual({ status: "empty" });
  });

  it("mantém zero como dado válido e preserva a coleção recebida", () => {
    const data = [0, 32] as const;
    const state = collectionState(data);
    expect(state.status).toBe("success");
    if (state.status === "success") expect(state.data).toBe(data);
  });

  it("resolve estados explícitos e separa dados das outras variantes no contrato", () => {
    expect(resolveCollection({ state: { status: "error" } })).toEqual({ status: "error" });
    expect(resolveCollection({ data: [] })).toEqual({ status: "empty" });
    expectTypeOf<Extract<CollectionState<number>, { status: "success" }>["data"]>().toEqualTypeOf<readonly [number, ...number[]]>();
    expectTypeOf<Exclude<UiState<number>, { status: "success" }>["data"]>().toEqualTypeOf<undefined>();
  });
});
