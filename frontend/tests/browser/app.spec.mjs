import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // All requests are synthetic; never submit credentials to an external API.
  await page.route('**/partner/login/', async route => {
    expect(route.request().postDataJSON()).toEqual({
      email_or_username: 'fixture@example.invalid', password: 'Fixture-test-only!',
    });
    await route.fulfill({ status: 401, json: { detail: 'Invalid credentials' } });
  });
});

test('login renders and retains the existing API contract and error message', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible();
  await page.getByPlaceholder('Логин').fill('fixture@example.invalid');
  await page.getByPlaceholder('Пароль').fill('Fixture-test-only!');
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page.getByText('Вы ввели неправильный адрес электронной почты или пароль')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
  expect(errors).toEqual([]);
  await page.screenshot({ path: `test-results/login-${test.info().project.name}.png`, fullPage: true });
});

test('authenticated routes, assets, camera form, profile and logout still work', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('fixture-initialized')) {
      localStorage.setItem('token', 'synthetic-test-token');
      localStorage.setItem('id', '1');
      sessionStorage.setItem('fixture-initialized', '1');
    }
  });
  for (const endpoint of ['list', 'model']) {
    await page.route(`**/camera/${endpoint}/`, async route => {
      expect(route.request().headers().authorization).toBe('Bearer synthetic-test-token');
      await route.fulfill({ json: { count: 0, results: [] } });
    });
  }
  await page.goto('/addcamera');
  await expect(page.getByRole('heading', { name: 'Добавить камеру' })).toBeVisible();
  await page.getByRole('link', { name: 'Профиль', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Настройки профиля' })).toBeVisible();
  await page.getByRole('link', { name: 'Обзор' }).click();
  // Vite must resolve all imported SVG/PNG assets on nested and index routes.
  expect(await page.locator('.sidebar img').evaluateAll(images =>
    images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  await page.getByRole('link', { name: 'Выход' }).click();
  await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible();
  expect(errors).toEqual([]);
});
