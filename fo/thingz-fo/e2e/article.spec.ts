import { test, expect } from "@playwright/test";

test.describe("아티클 상세 페이지", () => {
  let articleId: string | null = null;

  test.beforeAll(async ({ request }) => {
    const res = await request.get("http://localhost:8080/api/fo/articles");
    if (res.ok()) {
      const articles = await res.json();
      if (articles.length > 0) articleId = articles[0].id;
    }
  });

  test("존재하는 아티클 상세 페이지가 정상 로딩된다", async ({ page }) => {
    if (!articleId) { test.skip(); return; }
    await page.goto(`/ko/article/${articleId}`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
  });

  test("아티클 제목이 표시된다", async ({ page }) => {
    if (!articleId) { test.skip(); return; }
    const res = await page.request.get(`http://localhost:8080/api/fo/articles/${articleId}`);
    const article = await res.json();
    await page.goto(`/ko/article/${articleId}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(article.title).first()).toBeVisible({ timeout: 10_000 });
  });

  test("헤더 피드 링크가 표시된다", async ({ page }) => {
    if (!articleId) { test.skip(); return; }
    await page.goto(`/ko/article/${articleId}`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("header a", { hasText: "피드" }).first()).toBeVisible({ timeout: 10_000 });
  });

  test("헤더 피드 링크 클릭 시 메인으로 이동한다", async ({ page }) => {
    if (!articleId) { test.skip(); return; }
    await page.goto(`/ko/article/${articleId}`);
    await page.waitForLoadState("networkidle");
    await page.locator("header a", { hasText: "피드" }).first().click();
    await expect(page).toHaveURL(/\/ko(\/)?$/, { timeout: 10_000 });
  });

  test("이미지가 있는 아티클은 이미지가 렌더링된다", async ({ page }) => {
    if (!articleId) { test.skip(); return; }
    const res = await page.request.get(`http://localhost:8080/api/fo/articles/${articleId}`);
    const article = await res.json();
    if (!article.imageUrls || article.imageUrls.length === 0) { test.skip(); return; }
    await page.goto(`/ko/article/${articleId}`);
    await page.waitForLoadState("networkidle");
    const img = page.locator("img").first();
    await expect(img).toBeVisible({ timeout: 10_000 });
    const src = await img.getAttribute("src");
    expect(src).toContain("s3.ap-northeast-2.amazonaws.com");
  });

  test("존재하지 않는 아티클은 404 처리된다", async ({ page }) => {
    await page.goto("/ko/article/00000000-0000-0000-0000-000000000000");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/찾을 수 없/).first()).toBeVisible({ timeout: 15_000 });
  });

  test("사이드 패널에 작성자 정보가 표시된다", async ({ page }) => {
    if (!articleId) { test.skip(); return; }
    await page.goto(`/ko/article/${articleId}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/팔로워|follower/i).first()).toBeVisible({ timeout: 10_000 });
  });
});
