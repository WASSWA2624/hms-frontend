const { test } = require('@playwright/test');

test('capture dashboard crash', async ({ page }) => {
  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) {
      console.log(`[console:${msg.type()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', (error) => {
    console.log(`[pageerror] ${error && error.stack ? error.stack : error}`);
  });

  await page.goto('http://127.0.0.1:8081/login?step=identifier', { waitUntil: 'domcontentloaded' });

  await page.locator('input[type="text"], input[type="email"]').first().fill('tenantadmin@demo.com');
  await page.locator('input[type="password"]').first().fill('Demo@123!');

  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  for (let i = 0; i < count; i += 1) {
    const item = checkboxes.nth(i);
    if (!(await item.isChecked().catch(() => true))) {
      await item.check({ force: true }).catch(() => {});
    }
  }

  await page.locator('button:has-text("Sign In")').first().click();
  await page.waitForTimeout(7000);

  const fallback = await page.locator('text=Something went wrong').isVisible().catch(() => false);
  console.log(`[result] url=${page.url()} fallback=${fallback}`);
  await page.screenshot({ path: 'tmp/playwright-dashboard-state.png', fullPage: true });
});
