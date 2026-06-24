import { expect, test } from "@playwright/test";

const userId = "00000000-0000-0000-0000-000000000001";

const makeFakeJwt = () => {
  const payload = Buffer.from(JSON.stringify({ sub: userId, username: "testuser", exp: 9999999999 })).toString("base64url");
  return `eyJhbGciOiJIUzI1NiJ9.${payload}.fake-sig`;
};

test("account deletion requires username confirmation", async ({ page }) => {
  let deleteRequested = false;
  await page.addInitScript((token) => {
    localStorage.setItem("thingz_access_token", token);
    localStorage.setItem("thingz_refresh_token", "fake-refresh");
  }, makeFakeJwt());
  await page.route("**/api/fo/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (request.method() === "DELETE" && path.endsWith("/users/me")) {
      deleteRequested = true;
      await route.fulfill({ status: 204 });
      return;
    }
    if (path.endsWith("/users/me")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: userId,
          username: "testuser",
          displayName: "Test User",
          bio: null,
          avatarUrl: null,
          coverUrl: null,
          instagramId: null,
          kakaoUrl: null,
          articleCount: 0,
          followerCount: 0,
          followingCount: 0,
        }),
      });
      return;
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });

  await page.goto("/ko/mypage");
  await page.getByRole("button", { name: "회원 탈퇴", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "회원 탈퇴", exact: true });
  const confirmButton = dialog.getByRole("button", { name: "탈퇴하기", exact: true });
  await expect(confirmButton).toBeDisabled();
  await dialog.getByRole("textbox").fill("testuser");
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();

  await expect(page).toHaveURL(/\/ko$/);
  expect(deleteRequested).toBe(true);
  expect(await page.evaluate(() => localStorage.getItem("thingz_access_token"))).toBeNull();
});
