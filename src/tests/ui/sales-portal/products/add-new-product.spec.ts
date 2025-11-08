import test, { expect } from "@playwright/test";
import { credentials } from "config/env";
import _ from "lodash";
import { NOTIFICATIONS } from "data/salesPortal/notifications";
import { generateProductData } from "data/salesPortal/products/generateProductData";
import { HomePage } from "ui/pages/home.page";
import { LoginPage } from "ui/pages/login.page";
import { AddNewProductPage } from "ui/pages/products/addNewProduct.page";
import { ProductsListPage } from "ui/pages/products/productsList.page";

test.describe("[Sales Portal] [Products]", () => {
  test("Add new product", async ({ page }) => {
    const signInPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productsListPage = new ProductsListPage(page);
    const addNewProductPage = new AddNewProductPage(page);

    await signInPage.open();
    await signInPage.fillCredentials(credentials);
    await signInPage.clickOnLoginButton();

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

    const expectedResult = _.omit(productData, ["amount", "notes"]);
    const getTableData = await productsListPage.getLastProductData(
      productData.name
    );
    const actualResult = _.omit(getTableData, ["createdOn"]);
    expect(actualResult, "[ASSERT] Table data is correct").toEqual(
      expectedResult
    );
  });
});
