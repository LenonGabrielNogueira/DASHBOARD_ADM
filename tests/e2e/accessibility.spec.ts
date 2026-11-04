import { expect, test } from "@playwright/test";

test("permite pular ao conteúdo e operar o gráfico por teclado com foco visível", async ({ page, baseURL }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    return ["http:", "https:"].includes(url.protocol) && url.origin !== new URL(baseURL!).origin
      ? route.abort("blockedbyclient") : route.continue();
  });
  await page.goto("/analytics");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Ir para o conteúdo" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  const admissions = page.getByRole("region", { name: "Admissões mensais", exact: true });
  const chart = admissions.locator("svg.recharts-surface");
  await expect(chart).toBeVisible();
  await chart.focus();
  await expect(chart).toBeFocused();
  await expect.poll(() => chart.evaluate((element) => getComputedStyle(element).outlineWidth)).toBe("2px");
  await page.keyboard.press("ArrowRight");
  await expect(admissions.locator(".recharts-tooltip-wrapper")).toBeVisible();
  await expect(admissions.getByRole("group", { name: "Resumo textual: Admissões mensais" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
