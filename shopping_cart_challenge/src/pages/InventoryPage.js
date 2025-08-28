export class InventoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.inventoryContainer = page.locator('.inventory_list');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.addToCartButtons = page.locator('button.btn_inventory');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async getProductNames() {
    return this.productNames.allTextContents();
  }

  async getProductPrices() {
    const prices = await this.productPrices.allTextContents();
    return prices.map(price => parseFloat(price.replace('$', '')));
  }

  async addProductToCartByName(name) {
    const productNames = this.page.locator('.inventory_item_name');
    const addButtons = this.page.locator('button[data-test^="add-to-cart-"]');
    const count = await productNames.count();

    for (let i = 0; i < count; i++) {
        const productName = await productNames.nth(i).textContent();
        if (productName.trim() === name) {
        await addButtons.nth(i).click();
        return true;
        }
    }
    return false;
    }

  async removeProductFromCartByName(name) {
    const productCard = this.page.locator('.inventory_item', { hasText: name });
    await productCard.getByRole('button', { name: 'Remove' }).click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async sortBy(value) {
    await this.sortDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.sortDropdown.selectOption(value);
  }

  async openMenu() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
  }

  async closeMenu() {
    await this.page.getByRole('button', { name: 'Close Menu' }).click();
  }
}
