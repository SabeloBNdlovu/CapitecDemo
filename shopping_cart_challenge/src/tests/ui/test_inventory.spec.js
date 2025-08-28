import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { InventoryPage } from '../../pages/InventoryPage.js';
import { standardUser } from '../../data/loginData.js';

test.describe('Inventory Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('Test displays all products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);    
    const products = await inventoryPage.getProductNames();

    expect(products.length).toBeGreaterThan(0);
  });

  test('Test adds a product to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('Test removes a product from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
    await inventoryPage.removeProductFromCartByName('Sauce Labs Bike Light');

    const isBadgeVisible = await inventoryPage.cartBadge.isVisible();

    expect(isBadgeVisible).toBeFalsy();
  });

  test('Test sorts products by name A to Z (default)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('az');

    const productNames = await inventoryPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);

    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);

    expect(productNames[0]).toBe('Sauce Labs Backpack');
    expect(productNames[productNames.length - 1]).toBe('Test.allTheThings() T-Shirt (Red)');
  });

  test('Test sorts products by name Z to A', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('za');

    const productNames = await inventoryPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);

    const sortedNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedNames);

    expect(productNames[0]).toBe('Test.allTheThings() T-Shirt (Red)');
    expect(productNames[productNames.length - 1]).toBe('Sauce Labs Backpack');
  });

  test('Test sorts products by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('lohi');

    const productNames = await inventoryPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);

    const prices = await inventoryPage.getProductPrices();

    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);

    expect(prices[0]).toBe(7.99);
    expect(prices[prices.length - 1]).toBe(49.99);
  });

  test('Test sorts products by price high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('hilo');

    const productNames = await inventoryPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);

    const prices = await inventoryPage.getProductPrices();

    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);

    expect(prices[0]).toBe(49.99);
    expect(prices[prices.length - 1]).toBe(7.99);
  });

  test('Test opens and closes the menu', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.openMenu();

    await expect(page.getByRole('button', { name: 'Close Menu' })).toBeVisible();

    await inventoryPage.closeMenu();
    
    await expect(page.getByRole('button', { name: 'Close Menu' })).toBeHidden();
  });

});
