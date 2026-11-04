import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("combina classes condicionais sem incluir valores ausentes", () => {
    expect(
      cn("rounded", ["text-sm", false, null], { "font-bold": true, hidden: false }),
    ).toBe("rounded text-sm font-bold");
  });

  it("mantém a última classe conflitante sem remover variantes independentes", () => {
    expect(cn("px-2 hover:px-3", "px-4")).toBe("hover:px-3 px-4");
  });
});
