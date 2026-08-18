import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/raspored", "/uzrasti/2015", "/uzrasti/2016", "/uzrasti/2017", "/uzrasti/2019", "/galerija", "/o-nama", "/kontakt", "/privatnost"];

for (const route of routes) {
  test(`${route} renders without horizontal overflow`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
  });
}

test("main navigation works on mobile", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "Otvori izbornik" });
  if (await button.isVisible()) { await button.click(); await expect(page.getByRole("navigation", { name: "Mobilna navigacija" })).toBeVisible(); }
});

test("homepage has no serious automatic accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});

test("mobile hero keeps its photography, introduction and match ticket visible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.locator(".hero-media img")).toBeVisible();
  await expect(page.locator(".hero-copy > p")).toBeVisible();
  await expect(page.locator(".hero-ticket")).toBeVisible();
});

test("active navigation identifies the current page", async ({ page }) => {
  await page.goto("/galerija");
  await expect(page.locator('[aria-label="Glavna navigacija"] a[href="/galerija"]')).toHaveAttribute("aria-current", "page");
});

test("reduced motion removes decorative transitions and ticker movement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator(".reveal").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".ticker-track")).toHaveCSS("animation-name", "none");
});

test("original film is requested only after an explicit play action", async ({ page }) => {
  await page.goto("/");
  const video = page.locator(".matchday-film video");
  await expect(video.locator("source")).toHaveCount(0);

  await page.getByRole("button", { name: /pokreni video atmosfere/i }).click();
  await expect(video.locator("source")).toHaveCount(1);
  await expect(video).toHaveAttribute("controls", "");
});

test("homepage renders the correct announcement and sponsor assets", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('img[src*="WhatsApp-Image-2026-08-18-at-12.11.39-6.jpeg"]').first()).toBeAttached();
  await expect(page.locator('img[src*="Kup-grada-Skradina-poster.png"]').first()).toBeAttached();
  await expect(page.locator('img[src*="WhatsApp-Image-2026-02-09-at-20.58.08.jpeg"]').first()).toBeAttached();
  await expect(page.getByAltText(/Poliklinika Ribnjak, službeni sponzor/i)).toBeAttached();
});

test("gallery lightbox supports arrow navigation, Escape and focus restoration", async ({ page }) => {
  await page.goto("/galerija");
  const firstImage = page.locator(".gallery-item").first();
  await firstImage.click();
  await expect(page.getByRole("dialog")).toBeVisible();

  const startingLabel = await page.getByRole("dialog").getAttribute("aria-label");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog")).not.toHaveAttribute("aria-label", startingLabel ?? "");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(firstImage).toBeFocused();
});

for (const [legacy, current] of [["/raspored-utakmica/", "/raspored"], ["/uzrast-2015/", "/uzrasti/2015"], ["/uzrast-2016/", "/uzrasti/2016"], ["/uzrast-2017/", "/uzrasti/2017"], ["/uzrast-2019/", "/uzrasti/2019"], ["/kontrakt/", "/kontakt"]]) {
  test(`${legacy} redirects permanently`, async ({ request }) => {
    const response = await request.get(legacy, { maxRedirects: 0 });
    expect([301, 308]).toContain(response.status());
    expect(response.headers().location).toContain(current);
  });
}
