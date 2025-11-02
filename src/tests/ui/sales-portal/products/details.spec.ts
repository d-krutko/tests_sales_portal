import { test, expect } from "fixtures/business.fixture";
import { NOTIFICATIONS } from "data/salesPortal/notifications";
import { generateProductData } from "data/salesPortal/products/generateProductData";
import _ from "lodash";

test.describe("[Sales Portal] [Products]", () => {
  //test with fixtures version 1
  test("Product Details", async ({
    loginAsAdmin,
    homePage,
    productsListPage,
    addNewProductPage,
  }) => {
    await loginAsAdmin();
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
    await productsListPage.detailsButton(productData.name).click();
    const { detailsModal } = productsListPage;
    await detailsModal.waitForOpened();
    const actual = await detailsModal.getData();
    expect(_.omit(actual, ["createdOn"])).toEqual(productData);
  });
});
