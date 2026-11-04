import { expect, test } from "@playwright/test";

for (const width of [320, 768, 1440]) {
  test(`Analytics em ${width}px: três gráficos, resumos e navegação`, async ({ page, baseURL }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.route("**/*", (route) => {
      const url = new URL(route.request().url());
      return ["http:", "https:"].includes(url.protocol) && url.origin !== new URL(baseURL!).origin
        ? route.abort("blockedbyclient") : route.continue();
    });
    await page.goto("/dashboard");
    if (width < 1024) await page.getByRole("button", { name: "Abrir menu de navegação" }).click();
    await page.getByRole("link", { name: "Analytics", exact: true }).click();
    await expect(page).toHaveURL("/analytics");
    await expect(page).toHaveTitle("Analytics | Dashboard ADM");
    await expect(page.getByRole("heading", { name: "Analytics", level: 1 })).toBeVisible();
    for (const title of ["Admissões mensais", "Ativos por departamento", "Situação dos colaboradores"]) {
      const chart = page.getByRole("region", { name: title, exact: true });
      await expect(chart).toBeVisible();
      await expect(chart).toHaveAttribute("aria-describedby", /-description$/);
      await expect(chart.getByText("Dados demonstrativos", { exact: true })).toBeVisible();
      await expect(chart.locator("svg.recharts-surface")).toBeVisible();
      await expect(chart.getByRole("group", { name: `Resumo textual: ${title}` })).toBeVisible();
      expect(await chart.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
    const admissions = page.getByRole("region", { name: "Admissões mensais", exact: true });
    await expect(admissions.locator(".recharts-line-curve")).toHaveCount(1);
    const admissionsSummary = admissions.getByRole("group", { name: "Resumo textual: Admissões mensais" });
    await expect(admissionsSummary.getByText("Out/26", { exact: true })).toBeVisible();
    await expect(admissionsSummary.getByText("32 admissões", { exact: true })).toBeVisible();
    const departments = page.getByRole("region", { name: "Ativos por departamento", exact: true });
    await expect(departments.locator(".recharts-bar-rectangle")).toHaveCount(12);
    const departmentSummary = departments.getByRole("group", { name: "Resumo textual: Ativos por departamento" });
    await expect(departmentSummary.getByText("Tecnologia e desenvolvimento", { exact: true })).toBeVisible();
    await expect(departmentSummary.getByText("180 ativos", { exact: true })).toBeVisible();
    const status = page.getByRole("region", { name: "Situação dos colaboradores", exact: true });
    await expect(status.locator(".recharts-pie-sector")).toHaveCount(2);
    await expect(status.getByRole("group", { name: "Resumo textual: Situação dos colaboradores" })).toContainText("1.248 colaboradores");
    await expect(status.getByRole("list", { name: "Legenda da situação" })).toContainText("Ativos: 1.176");
    await expect(status.getByRole("list", { name: "Legenda da situação" })).toContainText("Desligados: 72");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`analytics-${width}.png`), fullPage: true, animations: "disabled" });
    expect(errors).toEqual([]);
  });
}
