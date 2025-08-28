export class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemRemoveButtons = page.locator('button[data-test^="remove-"]');
    this.emptyCartMessage = page.locator('.cart_empty');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getCartItemNames() {
    return await this.cartItemNames.allTextContents();
  }

  async removeItemByName(name) {
    const count = await this.cartItemNames.count();
    for (let i = 0; i < count; i++) {
      const itemName = await this.cartItemNames.nth(i).textContent();
      if (itemName.trim() === name) {
        await this.cartItemRemoveButtons.nth(i).click();
        return true;
      }
    }
    return false;
  }
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async isCheckoutButtonVisible() {
    return this.checkoutButton.isVisible();
  }
}
