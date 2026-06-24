import { expect, test } from "@playwright/test";

test.describe("locale routing", () => {
  test("Japanese route renders Japanese content", async ({ page }) => {
    await page.goto("/ja");

    await expect(page).toHaveURL(/\/ja$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.getByText("今日のエディター").first()).toBeVisible();
  });

  test("language switcher updates the locale route", async ({ page }) => {
    await page.goto("/ko");

    await page.getByRole("button", { name: "日", exact: true }).click();
    await expect(page).toHaveURL(/\/ja$/);
    await expect(page.getByText("最近の記事").first()).toBeVisible();

    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByText("Recent Articles").first()).toBeVisible();
  });

  test("authenticated hydration does not flash the login gate", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    const payload = Buffer.from(JSON.stringify({
      sub: "00000000-0000-0000-0000-000000000001",
      username: "testuser",
      exp: 9999999999,
    })).toString("base64url");
    const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.fake-sig`;
    await page.addInitScript((accessToken) => {
      localStorage.setItem("thingz_access_token", accessToken);
      localStorage.setItem("thingz_refresh_token", "fake-refresh");
    }, token);

    await page.goto("/ja/write");
    await expect(page.getByRole("button", { name: "公開する" })).toBeVisible();
    await expect(page.getByRole("button", { name: "ログイン" })).not.toBeVisible();
    expect(consoleErrors.filter((message) => message.includes("Hydration"))).toEqual([]);
  });

  test("OAuth callback returns to the stored Japanese locale", async ({ page, context }) => {
    await context.addCookies([{
      name: "auth_return_locale",
      value: "ja",
      domain: "localhost",
      path: "/",
    }]);

    await page.goto("/ko/auth/callback?accessToken=fake-access&refreshToken=fake-refresh");

    await expect(page).toHaveURL(/\/ja$/);
  });
});
