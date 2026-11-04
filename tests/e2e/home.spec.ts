import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page, baseURL }) => {
  const allowedOrigin = new URL(baseURL!).origin;
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (["http:", "https:"].includes(url.protocol) && url.origin !== allowedOrigin) {
      return route.abort("blockedbyclient");
    }
    return route.continue();
  });
});

test("abre a página pública sem credenciais ou serviços externos", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Create Next App");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("To get started");
  await expect(page.getByRole("link", { name: "Documentation", exact: true }))
    .toHaveAttribute("href", /^https:\/\/nextjs\.org\/docs/);
});

test("permite retornar à página inicial após uma rota inexistente", async ({ page }) => {
  await page.goto("/");
  const response = await page.goto("/rota-inexistente-teste");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("To get started");
});
