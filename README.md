# CapitecDemo
Shopping_cart_challenge:
Automated test suite for UI and API testing using [Playwright](https://playwright.dev).  
This project is built for validating the functionality of an e-commerce-like platform (`saucedemo.com`) and a RESTful booking API (`restful-booker.herokuapp.com`).

## 1. Clone the Repo

```bash
git clone https://github.com/SabeloBNdlovu/shopping_cart_challenge.git
cd shopping_cart_challenge

2. Install Dependencies

npm ci

3. Install Playwright Browsers

npx playwright install

4. Run All Tests

npx playwright test

5. Run Only UI Tests

npx playwright test src/tests/ui

6. Run Only API Tests

npx playwright test src/tests/api