import { expect, test } from "@playwright/test";

for (const { width, columns } of [{ width: 320, columns: 1 }, { width: 768, columns: 2 }, { width: 1440, columns: 4 }]) {
  test(`KPIs demonstrativos em ${width}px: ${columns} coluna(s) sem overflow`, async ({ page, baseURL }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.route("**/*", (route) => {
      const url = new URL(route.request().url());
      return ["http:", "https:"].includes(url.protocol) && url.origin !== new URL(baseURL!).origin
        ? route.abort("blockedbyclient") : route.continue();
    });
    await page.goto("/dashboard");
    await expect(page.getByRole("complementary", { name: "Dados demonstrativos" })).toBeVisible();
    const grid = page.getByRole("list", { name: "Indicadores administrativos" });
    await expect(grid.getByRole("article")).toHaveCount(4);
    for (const [title, value] of [["Total de colaboradores", "1.248"], ["Colaboradores ativos", "1.176"], ["Total de departamentos", "12"], ["Admissões no período", "32"]]) {
      const card = grid.getByRole("article", { name: title });
      await expect(card).toBeVisible();
      await expect(card.getByText(value, { exact: true })).toBeVisible();
      await expect(card.getByText("Demonstração")).toBeVisible();
      expect(await card.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
    await expect.poll(() => grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length)).toBe(columns);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`kpis-${width}.png`), fullPage: true, animations: "disabled" });
  });
}
