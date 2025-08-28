import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { standardUser } from '../../data/loginData.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CheckoutPage } from '../../pages/CheckoutPage.js';

test.describe('Checkout Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
  });

  test('Test checkout form submits successfully with valid data', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.goto();
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await cartPage.goto();
    await page.locator('[data-test="checkout"]').click();

    await checkoutPage.fillCheckoutForm('Kevin', 'Smith', '12345');
    await checkoutPage.continue();

    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  });

  test('Test checkout form shows error for missing first name', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await page.goto('/cart.html');
    await page.locator('[data-test="checkout"]').click();

    await checkoutPage.fillCheckoutForm('', 'Smith', '12345');
    await checkoutPage.continue();

    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Error: First Name is required');
  });

  test('Test checkout form shows error for missing last name', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await page.goto('/cart.html');
    await page.locator('[data-test="checkout"]').click();

    await checkoutPage.fillCheckoutForm('Kevin', '', '12345');
    await checkoutPage.continue();

    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Error: Last Name is required');
  });

  test('Test checkout form shows error for missing postal code', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await page.goto('/cart.html');
    await page.locator('[data-test="checkout"]').click();

    await checkoutPage.fillCheckoutForm('Kevin', 'Smith', '');
    await checkoutPage.continue();

    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Error: Postal Code is required');
  });

  test('Test cancel button returns to cart page', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await page.goto('/cart.html');
    await page.locator('[data-test="checkout"]').click();
    await checkoutPage.cancel();

    await expect(page).toHaveURL(/\/cart\.html$/);
  });

});
