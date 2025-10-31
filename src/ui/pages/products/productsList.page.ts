import { MANUFACTURERS } from "data/salesPortal/products/manufacturers";
import { SalesPortalPage } from "../salesPortal.page";
import { IProductInTable } from "data/types/product.types";

export class ProductsListPage extends SalesPortalPage {
  readonly productsPageTitle = this.page.locator("h2.fw-bold");
  readonly addNewProductButton = this.page.locator('[name="add-button"]');
  readonly tableRowByName = (productName: string) =>
    this.page.locator("table tbody tr", {
      has: this.page.locator("td", { hasText: productName }),
    });

  readonly uniqueElement = this.addNewProductButton;

  async getLastProductData(productName: string): Promise<IProductInTable> {
    const [name, price, manufacturer, createdOn] = await this.tableRowByName(
      productName
    )
      .locator("td")
      .allInnerTexts();
    return {
      name: name!,
      price: +price!.replace("$", ""),
      manufacturer: manufacturer! as MANUFACTURERS,
      createdOn: createdOn!,
    };
  }

  async clickAddNewProduct() {
    await this.addNewProductButton.click();
  }
}
