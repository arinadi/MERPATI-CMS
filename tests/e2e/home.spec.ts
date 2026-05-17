import { test, expect } from '@playwright/test';

test('successfully loads the homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});

test('can navigate to the login page', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('body')).toBeVisible();
});
