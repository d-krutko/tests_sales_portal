import {
  createProductWithInvalidData,
  createProductWithValidData,
} from "data/products/createProduct.data";
import { generateProductData } from "data/products/generateProductData";
import { createProductSchema } from "data/schemas/products/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { test } from "fixtures/api.fixture";
import { validateResponse } from "utils/validations/validateResponse.utils";

// Используя DDT подход, напишите тест сьют для проверки эндпоинта создания продукта:
//   - с позитивными проверками
//   - с негативыми проверками

//   Используйте LoginApiService, ProductsApi, после каждого теста, где создастся продукт -
// удаляйте его.

//   Требования:
//   Name: обязательное, уникальное, Products's name should contain only 3-40 alphanumerical
// characters and one space between
//   Manufacturer: обязательное
//   Price: обязательное, Price should be in range 1-99999
//   Amount: обязательное, Amount should be in range 0-999
//   Notes: Notes should be in range 0-250 and without < or > symbols

test.describe("[API] [Sales Portal] [Products] Create", () => {
  test.describe("Positive cheks", () => {
    let id = "";
    let token = "";

    test.beforeEach(async ({ loginApiService }) => {
      token = await loginApiService.loginAsAdmin();
    });
    test.afterEach(async ({ productsApiService }) => {
      if (id) await productsApiService.delete(token, id);
      id = "";
    });

    for (const { title, checkingValue } of createProductWithValidData) {
      test(title, async ({ productsApi }) => {
        const productData = generateProductData(checkingValue);
        const createdProduct = await productsApi.create(productData, token);
        validateResponse(createdProduct, {
          status: STATUS_CODES.CREATED,
          IsSuccess: true,
          ErrorMessage: null,
          schema: createProductSchema,
        });
        id = createdProduct.body.Product._id;
      });
    }
  });

  test.describe("Negative checks", () => {
    let token = "";

    test.beforeEach(async ({ loginApiService }) => {
      token = await loginApiService.loginAsAdmin();
    });

    for (const { title, checkingValue } of createProductWithInvalidData) {
      test(title, async ({ productsApi }) => {
        const productData = generateProductData(checkingValue);
        const createdProduct = await productsApi.create(productData, token);
        validateResponse(createdProduct, {
          status: STATUS_CODES.BAD_REQUEST,
          IsSuccess: false,
          ErrorMessage: "Incorrect request body",
        });
      });
    }
  });
});
