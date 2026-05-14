import { test, expect } from "@playwright/test";

test.describe("아티클 상세 페이지 (/article/[id])", () => {
  let articleId: string | null = null;

  test.beforeAll(async ({ request }) => {
    const res = await request.get("http://localhost:8080/api/fo/articles");
    if (res.ok()) {
      const articles = await res.json();
      if (articles.length > 0) articleId = articles[0].id;
    }
  });

  test("존재하는 아티클 상세 페이지가 정상 로딩된다", async ({ page }) => {
    if (!articleId) {
      test.skip();
      return;
    }
    await page.goto(`/article/${articleId}`);
    await expect(page.getByText("← 피드로 돌아가기")).toBeVisible();
  });

  test("아티클 상세에서 피드로 돌아가기 링크가 동작한다", async ({ page }) => {
    if (!articleId) {
      test.skip();
      return;
    }
    await page.goto(`/article/${articleId}`);
    await page.getByText("← 피드로 돌아가기").click();
    await expect(page).toHaveURL("/");
  });

  test("존재하지 않는 아티클은 404 처리된다", async ({ page }) => {
    await page.goto("/article/00000000-0000-0000-0000-000000000000");
    await expect(page.getByText("페이지를 찾을 수 없어요")).toBeVisible({ timeout: 15_000 });
  });
});
