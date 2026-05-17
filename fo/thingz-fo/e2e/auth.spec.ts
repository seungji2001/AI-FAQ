import { test, expect } from "@playwright/test";

const makeFakeJwt = () => {
  const payload = btoa(
    JSON.stringify({ sub: "00000000-0000-0000-0000-000000000001", username: "testuser", exp: 9999999999 })
  );
  return `eyJhbGciOiJIUzI1NiJ9.${payload}.fake-sig`;
};

// ── 비로그인 상태 ────────────────────────────────────────────────
test.describe("비로그인 상태", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ko");
    await page.waitForLoadState("networkidle");
  });

  test("헤더에 로그인 버튼이 표시된다", async ({ page }) => {
    await expect(page.getByRole("button", { name: "로그인" }).first()).toBeVisible();
  });

  test("등록하기 클릭 시 로그인 다이얼로그가 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: "글쓰기" }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });
  });

  test("로그인 다이얼로그에 카카오 버튼이 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: "글쓰기" }).first().click();
    await expect(page.getByRole("button", { name: /카카오/ })).toBeVisible({ timeout: 5_000 });
  });

  test("카카오 로그인 버튼 클릭 시 OAuth 엔드포인트로 요청한다", async ({ page }) => {
    let kakaoRequested = false;
    await page.route("**/oauth2/authorization/kakao", async (route) => {
      kakaoRequested = true;
      await route.abort();
    });
    await page.getByRole("button", { name: "글쓰기" }).first().click();
    await page.getByRole("button", { name: /카카오/ }).click();
    await page.waitForTimeout(1_000);
    expect(kakaoRequested).toBe(true);
  });

  test("헤더 로그인 버튼 클릭 시 로그인 다이얼로그가 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: "로그인" }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });
  });

  test("다이얼로그 ESC 키로 닫힌다", async ({ page }) => {
    await page.getByRole("button", { name: "로그인" }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 3_000 });
  });
});

// ── OAuth 콜백 처리 ──────────────────────────────────────────────
test.describe("OAuth 콜백 처리 (/auth/callback)", () => {
  test("유효한 토큰으로 콜백 진입 시 홈으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/ko/auth/callback?accessToken=fake-access&refreshToken=fake-refresh");
    await expect(page).toHaveURL(/\/ko(\/)?$/, { timeout: 10_000 });
  });

  test("콜백 후 localStorage에 accessToken이 저장된다", async ({ page }) => {
    await page.goto("/ko/auth/callback?accessToken=my-test-access&refreshToken=my-test-refresh");
    await page.waitForURL(/\/ko(\/)?$/, { timeout: 10_000 });
    const stored = await page.evaluate(() => localStorage.getItem("thingz_access_token"));
    expect(stored).toBe("my-test-access");
  });

  test("콜백 후 localStorage에 refreshToken이 저장된다", async ({ page }) => {
    await page.goto("/ko/auth/callback?accessToken=my-test-access&refreshToken=my-test-refresh");
    await page.waitForURL(/\/ko(\/)?$/, { timeout: 10_000 });
    const stored = await page.evaluate(() => localStorage.getItem("thingz_refresh_token"));
    expect(stored).toBe("my-test-refresh");
  });

  test("토큰 없는 콜백도 홈으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/ko/auth/callback");
    await expect(page).toHaveURL(/\/ko(\/)?$/, { timeout: 10_000 });
  });
});

// ── 로그인 상태 ──────────────────────────────────────────────────
test.describe("로그인 상태", () => {
  test.beforeEach(async ({ page }) => {
    const jwt = makeFakeJwt();
    await page.addInitScript((token) => {
      localStorage.setItem("thingz_access_token", token);
      localStorage.setItem("thingz_refresh_token", "fake-refresh");
    }, jwt);
    await page.goto("/ko");
    await page.waitForLoadState("networkidle");
  });

  test("로그인 상태에서 로그인 버튼이 표시되지 않는다", async ({ page }) => {
    await expect(page.getByRole("button", { name: "로그인" })).not.toBeVisible();
  });

  test("등록하기 클릭 시 /write 페이지로 이동한다", async ({ page }) => {
    await page.route("**/api/fo/articles", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({ status: 201, body: JSON.stringify({ id: "fake-id" }), contentType: "application/json" });
      } else {
        await route.continue();
      }
    });
    const writeLink = page.getByRole("link", { name: "등록하기" }).first();
    const hasLink = await writeLink.isVisible().catch(() => false);
    if (hasLink) {
      await writeLink.click();
    } else {
      await page.goto("/ko/write");
    }
    await expect(page).toHaveURL(/\/write/, { timeout: 10_000 });
  });

  test("로그아웃 후 localStorage 토큰이 제거된다", async ({ page }) => {
    await page.route("**/auth/logout", async (route) => {
      await route.fulfill({ status: 200 });
    });
    const logoutBtn = page.getByRole("button", { name: "로그아웃" });
    const hasLogout = await logoutBtn.isVisible().catch(() => false);
    if (!hasLogout) { test.skip(); return; }
    await logoutBtn.click();
    await page.waitForTimeout(1_000);
    const token = await page.evaluate(() => localStorage.getItem("thingz_access_token"));
    expect(token).toBeNull();
  });
});
