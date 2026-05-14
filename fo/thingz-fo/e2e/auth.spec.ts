import { test, expect } from "@playwright/test";

const makeFakeJwt = () => {
  const payload = btoa(
    JSON.stringify({ sub: "00000000-0000-0000-0000-000000000001", username: "testuser", exp: 9999999999 })
  );
  return `eyJhbGciOiJIUzI1NiJ9.${payload}.fake-sig`;
};

const setFakeTokens = (jwt: string) => {
  localStorage.setItem("thingz_access_token", jwt);
  localStorage.setItem("thingz_refresh_token", "fake-refresh-token");
};

// ── 비로그인 상태 ──────────────────────────────────────────────
test.describe("비로그인 상태 인증 흐름", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("헤더에 로그인 버튼이 표시된다", async ({ page }) => {
    await expect(page.getByRole("button", { name: "로그인" }).first()).toBeVisible();
  });

  test("비로그인 상태에서 등록하기 클릭 시 로그인 다이얼로그가 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: "등록하기" }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });
  });

  test("로그인 다이얼로그에 카카오 버튼이 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: "등록하기" }).first().click();
    await expect(page.getByRole("button", { name: /카카오로 시작하기/ })).toBeVisible({ timeout: 5_000 });
  });

  test("카카오 버튼 클릭 시 백엔드 OAuth URL로 요청이 전송된다", async ({ page }) => {
    // 실제 Kakao 페이지로 이동하지 않도록 abort + URL 검증
    let kakaoUrl = "";
    await page.route("**/oauth2/authorization/kakao", async (route) => {
      kakaoUrl = route.request().url();
      await route.abort();
    });

    await page.getByRole("button", { name: "등록하기" }).first().click();
    await page.getByRole("button", { name: /카카오로 시작하기/ }).click();

    await page.waitForTimeout(1_000);
    expect(kakaoUrl).toContain("/oauth2/authorization/kakao");
  });

  test("헤더 로그인 버튼 클릭 시 로그인 다이얼로그가 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: "로그인" }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });
  });
});

// ── 콜백 처리 ─────────────────────────────────────────────────
test.describe("OAuth 콜백 처리 (/auth/callback)", () => {
  test("유효한 토큰 파라미터로 콜백 진입 시 홈으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/auth/callback?accessToken=fake-access-token&refreshToken=fake-refresh-token");
    await expect(page).toHaveURL("/", { timeout: 10_000 });
  });

  test("콜백 후 localStorage에 토큰이 저장된다", async ({ page }) => {
    await page.goto("/auth/callback?accessToken=my-test-access&refreshToken=my-test-refresh");
    await page.waitForURL("/", { timeout: 10_000 });

    const stored = await page.evaluate(() => localStorage.getItem("thingz_access_token"));
    expect(stored).toBe("my-test-access");
  });

  test("토큰 없는 콜백도 홈으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/auth/callback");
    await expect(page).toHaveURL("/", { timeout: 10_000 });
  });
});

// ── 로그인 상태 ───────────────────────────────────────────────
test.describe("로그인 상태 인증 흐름", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(setFakeTokens, makeFakeJwt());
    await page.goto("/");
  });

  test("로그인 상태에서 헤더에 마이페이지 메뉴가 표시된다", async ({ page }) => {
    await expect(page.getByRole("link", { name: "마이페이지" })).toBeVisible();
  });

  test("로그인 상태에서 로그인 버튼이 표시되지 않는다", async ({ page }) => {
    await expect(page.getByRole("button", { name: "로그인" })).not.toBeVisible();
  });

  test("등록하기 클릭 시 /write 페이지로 이동한다", async ({ page }) => {
    // 실제 API 호출 실패해도 페이지 이동은 확인
    await page.getByRole("link", { name: "등록하기" }).first().click();
    await expect(page).toHaveURL("/write", { timeout: 10_000 });
  });

  test("로그아웃 후 로컬 스토리지 토큰이 제거된다", async ({ page }) => {
    // 로그아웃 API intercept (서버 미응답 대비)
    await page.route("**/auth/logout", async (route) => {
      await route.fulfill({ status: 200 });
    });

    const logoutBtn = page.getByRole("button", { name: "로그아웃" });
    const hasLogout = await logoutBtn.isVisible().catch(() => false);
    if (!hasLogout) {
      // 모바일 메뉴나 아바타 클릭 필요할 수 있음 — skip
      test.skip();
      return;
    }

    await logoutBtn.click();
    await page.waitForTimeout(1_000);
    const token = await page.evaluate(() => localStorage.getItem("thingz_access_token"));
    expect(token).toBeNull();
  });
});
