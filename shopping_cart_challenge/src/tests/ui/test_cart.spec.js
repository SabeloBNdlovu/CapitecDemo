import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { standardUser } from '../../data/loginData.js';

test.describe('Cart Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
  });

  test('Test cart is empty initially', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.goto();

    const count = await cartPage.getCartItemCount();
    expect(count).toBe(0);
  });

  test('Test add product to cart and verify in cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');

    await page.goto('/cart.html');
    const count = await cartPage.getCartItemCount();
    expect(count).toBeGreaterThan(0);

    const names = await cartPage.getCartItemNames();
    expect(names).toContain('Sauce Labs Backpack');
  });

  test('Test remove product from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Bolt T-Shirt');
    await page.goto('/cart.html');

    let count = await cartPage.getCartItemCount();
    expect(count).toBeGreaterThan(0);

    const removed = await cartPage.removeItemByName('Sauce Labs Bolt T-Shirt');
    expect(removed).toBe(true);

    count = await cartPage.getCartItemCount();
    expect(count).toBe(0);
  });

  test('Test checkout button visible when cart has items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Fleece Jacket');
    await page.goto('/cart.html');

    expect(await cartPage.isCheckoutButtonVisible()).toBe(true);
  });

//TODO:CONFIRM BUG
  // test('Test checkout button disabled when cart is empty', async ({ page }) => {
  //   const cartPage = new CartPage(page);
  
  //   await cartPage.goto();

  //   expect(await cartPage.isCheckoutButtonVisible()).toBe(false);
  // });

  test('Test continue shopping button navigates back to inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Onesie');
    await page.goto('/cart.html');

    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory/);
  });

  test('Test items remain in cart after navigating back', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    const productName = 'Sauce Labs Backpack';
    await inventoryPage.goto();
    await inventoryPage.addProductToCartByName(productName);

    await cartPage.goto();
    let cartItems = await cartPage.getCartItemNames();
    expect(cartItems).toContain(productName);

    await cartPage.continueShopping();
    await expect(page).toHaveURL(/\/inventory\.html$/);

    await cartPage.goto();

    cartItems = await cartPage.getCartItemNames();
    expect(cartItems).toContain(productName);
  });

});