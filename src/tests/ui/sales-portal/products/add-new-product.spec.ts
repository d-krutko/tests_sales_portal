import { test, expect } from "fixtures/business.fixture";
import { credentials } from "config/env";
import { NOTIFICATIONS } from "data/notifications";
import { generateProductData } from "data/products/generateProductData";

test.describe("[Sales Portal] [Products]", async () => {
  test("Add new product", async ({
    homePage,
    loginPage,
    productsListPage,
    addNewProductPage,
  }) => {
    await loginPage.open();
    await loginPage.fillCredentials(credentials);
    await loginPage.clickOnLoginButton();

    await homePage.open();
    await homePage.waitForOpened();
    await homePage.clickOnViewModule("Products");
    await productsListPage.waitForOpened();
    await productsListPage.clickAddNewProduct();
    await addNewProductPage.waitForOpened();
    const productData = generateProductData();
    await addNewProductPage.fillForm(productData);
    await addNewProductPage.clickSave();
    await productsListPage.waitForOpened();
    await expect(productsListPage.toastMessage).toContainText(
      NOTIFICATIONS.PRODUCT_CREATED
    );
    await expect(
      productsListPage.tableRowByName(productData.name)
    ).toBeVisible();
  });
});

//locators !
//waiterForPage !
//product data generator
//teardown
