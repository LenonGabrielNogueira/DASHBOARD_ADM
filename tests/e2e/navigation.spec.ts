import { expect, test, type Page } from "@playwright/test";

const modules = [
  ["Dashboard", "/dashboard"], ["Analytics", "/analytics"], ["Pessoas", "/pessoas"],
  ["Departamentos", "/departamentos"], ["Relatórios", "/relatorios"],
] as const;

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test.beforeEach(async ({ page, baseURL }) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    return ["http:", "https:"].includes(url.protocol) && url.origin !== new URL(baseURL!).origin
      ? route.abort("blockedbyclient") : route.continue();
  });
});

test("navega pelos cinco módulos no desktop com rota ativa e conteúdo próprio", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/dashboard");
  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(nav.getByRole("link")).toHaveCount(5);
  await expect(page.getByRole("button", { name: "Abrir menu de navegação" })).toBeHidden();
  await page.screenshot({ path: testInfo.outputPath("desktop.png"), fullPage: true, animations: "disabled" });
  for (const [title, href] of modules) {
    await nav.getByRole("link", { name: title, exact: true }).click();
    await expect(page).toHaveURL(href);
    await expect(page).toHaveTitle(`${title} | Dashboard ADM`);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    if (href === "/dashboard") {
      await expect(page.getByRole("region", { name: "Indicadores administrativos" })).toBeVisible();
      await expect(page.getByRole("complementary", { name: "Dados demonstrativos" })).toBeVisible();
    } else {
      await expect(page.getByRole("heading", { name: "Módulo em desenvolvimento" })).toBeVisible();
    }
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(nav.getByRole("link", { name: title, exact: true })).toHaveAttribute("aria-current", "page");
    await expectNoOverflow(page);
  }
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1, name: "Departamentos" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Departamentos", exact: true })).toHaveAttribute("aria-current", "page");
});

for (const width of [320, 768]) {
  test(`menu em ${width}px: teclado, fechamento e navegação sem overflow`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/dashboard");
    // O diálogo modal oculta o restante da página da árvore de acessibilidade.
    const trigger = page.getByRole("button", { name: "Abrir menu de navegação", includeHidden: true });
    const dialog = page.getByRole("dialog", { name: "Menu de navegação" });
    await expectNoOverflow(page);
    await page.screenshot({ path: testInfo.outputPath(`viewport-${width}.png`), fullPage: true, animations: "disabled" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(dialog.getByRole("link")).toHaveCount(5);
    for (let tab = 0; tab < 8; tab++) {
      await page.keyboard.press("Tab");
      await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await dialog.getByRole("button", { name: "Fechar menu de navegação" }).click();
    await expect(dialog).toBeHidden();
    for (const [title, href] of modules) {
      await trigger.click();
      await expect(dialog).toBeVisible();
      await dialog.getByRole("link", { name: title, exact: true }).click();
      await expect(dialog).toBeHidden();
      await expect(page).toHaveURL(href);
      await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
      await expectNoOverflow(page);
    }
    await trigger.click();
    await expect(dialog.getByRole("link", { name: "Relatórios", exact: true })).toHaveAttribute("aria-current", "page");
    await page.screenshot({ path: testInfo.outputPath(`menu-${width}.png`), fullPage: true, animations: "disabled" });
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
    await expectNoOverflow(page);
  });
}
