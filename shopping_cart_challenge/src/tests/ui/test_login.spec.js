import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { standardUser, lockedOutUser, problemUser, performanceGlitchUser, errorUser, visualUser} from '../../data/loginData.js';

test.describe('Login Page Tests', () => {
test('Test login with standard_user credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(standardUser.username, standardUser.password);

  await expect(page).toHaveURL(/inventory/);
});

test('Test login with locked_out_user credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(lockedOutUser.username, lockedOutUser.password);

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

test('Test login with problem_user credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(problemUser.username, problemUser.password);

    await expect(page).toHaveURL(/inventory/);
});

test('Test login with performance_glitch_user credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(performanceGlitchUser.username, performanceGlitchUser.password);

  await expect(page).toHaveURL(/inventory/, { timeout: 60_000 });
});

test('Test login with error_user credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(errorUser.username, errorUser.password);

    await expect(page).toHaveURL(/inventory/);
});

test('Test login with visual_user credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(visualUser.username, visualUser.password);

    await expect(page).toHaveURL(/inventory/);
});

});