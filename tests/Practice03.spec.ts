import { test, expect, Page} from '@playwright/test';

test('Practice 03', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
// 1. Confirm that the user can login successfully using valid credentials
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page.locator("xpath=//span[text()='Products']")).toBeVisible();
  
// 2. Confirm that the product list contains exactly six items.
  await expect(page.locator("//div[@class='inventory_item']")).toHaveCount(6);

// 3. Confirm that each product in the list displays its price
  let result: boolean = await eachProductHaveEachPrice(page);
  expect(result).toBe(true);

// 4. Confirm that the product is successfully added to the cart
  await page.locator("xpath=//div[text()='Sauce Labs Backpack']/../../..//button[@id='add-to-cart-sauce-labs-backpack']").click();
  await page.locator("#shopping_cart_container").click();
  await expect(page.locator("xpath=//div[@class='cart_quantity' and text()='1']/..//div[@class='inventory_item_name' and text()='Sauce Labs Backpack']")).toBeVisible();
});

async function eachProductHaveEachPrice(page: Page): Promise<boolean> {
  let count = await page.locator("//div[@class='inventory_item']").count();
  let result: boolean = false;
  for (let i = 1; i <= count; i++) {
      result = await page.locator("xpath=(//div[@class='inventory_item'])[" + i + "]//div[@class='inventory_item_price']" ).isVisible()
      if (!result)
        break;
  }
  return result;
}
