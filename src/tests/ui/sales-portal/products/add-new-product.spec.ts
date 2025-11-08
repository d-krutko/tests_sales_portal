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

// Используя DDT подход, напишите тест сьют для проверки эндпоинта создания продукта:
//   - с позитивными проверками

//   Используйте LoginApiService, ProductsApi, после каждого теста, где создастся продукт - удаляйте его.

//   Требования:
//   Name: обязательное, уникальное, Products's name should contain only 3-40 alphanumerical characters and one space between
//   Manufacturer: обязательное
//   Price: обязательное, Price should be in range 1-99999
//   Amount: обязательное, Amount should be in range 0-999
//   Notes: Notes should be in range 0-250 and without < or > symbols





// Используя DDT подход, напишите тест сьют для проверки эндпоинта создания продукта:
//   - с негативыми проверками