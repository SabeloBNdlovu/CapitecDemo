import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CheckoutPage } from '../../pages/CheckoutPage.js';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage.js';
import { standardUser } from '../../data/loginData.js';

test.describe('Checkout Overview Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);

    await inventoryPage.goto();
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await cartPage.goto();
    await page.locator('[data-test="checkout"]').click();
    await checkoutPage.fillCheckoutForm('Kevin', 'Smith', '12345');
    await checkoutPage.continue();

    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  });

  test('Test overview page displays correct item and totals', async ({ page }) => {
    const overviewPage = new CheckoutOverviewPage(page);

    const items = await overviewPage.getCartItemNames();
    expect(items).toContain('Sauce Labs Backpack');

    const { itemTotal, tax, total } = await overviewPage.getSummaryValues();

    expect(itemTotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('Test finish button completes the order', async ({ page }) => {
    const overviewPage = new CheckoutOverviewPage(page);

    await overviewPage.finish();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
  });

  test('Test cancel button returns to inventory page', async ({ page }) => {
    const overviewPage = new CheckoutOverviewPage(page);

    await overviewPage.cancel();

    await expect(page).toHaveURL(/\/inventory\.html$/);
  });
  
});
