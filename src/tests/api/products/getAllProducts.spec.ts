// Написать смоук API тест на получение всех продуктов (без фильтрационных параметров) со следующими шагами:
//   - Залогиниться
//   - Создать продукт и проверить 201й статус
//   - Получить все продукты
//   - создать и проверить схему
//   - проверить статус
//   - проверить, что в массиве тела респонса есть созданный продукт
//   - Проверить поля IsSuccess и ErrorMessage

import test, { expect } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { credentials } from "config/env";
import { generateProductData } from "data/products/generateProductData";
import { loginSchema } from "data/schemas/login.schema";
import { createProductSchema } from "data/schemas/products/create.schema";
import { getAllProductsSchema } from "data/schemas/products/getAllProducts.schema";
import { STATUS_CODES } from "data/statusCodes";
import { IProductFromResponse } from "data/types/product.types";
import _ from "lodash";
import { validateJsonSchema } from "utils/schema.utils";
import { validateResponse } from "utils/validations/validateResponse.utils";

const { baseURL, endpoints } = apiConfig;

test.describe("[API] [Sales Portal] [Products] - Smoke", () => {
  let token = "";
  let createdProductId = "";
  let productData: "";

  test.afterEach(async ({ request }) => {
    // Очистка: удаляем созданный продукт
    if (createdProductId) {
      const response = await request.delete(
        `${baseURL}${endpoints.productById(createdProductId)}`,
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      expect(response.status()).toBe(STATUS_CODES.DELETED);
    }
  });

  test("Get All Products - Smoke", async ({ request }) => {
    // Шаг 1: Залогиниться
    const loginResponse = await request.post(baseURL + endpoints.login, {
      data: credentials,
      headers: {
        "content-type": "application/json",
      },
    });

    await validateResponse(loginResponse, {
      status: STATUS_CODES.OK,
      schema: loginSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });

    const headers = loginResponse.headers();
    token = headers["authorization"]!;
    expect(token).toBeTruthy();

    // Шаг 2: Создать продукт и проверить 201 статус
    const productData = generateProductData();
    const createProductResponse = await request.post(
      baseURL + endpoints.products,
      {
        data: productData,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const createProductBody = await createProductResponse.json();
    await validateResponse(createProductResponse, {
      status: STATUS_CODES.CREATED,
      schema: createProductSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });

    createdProductId = createProductBody.Product._id;
    expect(createdProductId).toBeTruthy();

    // Шаг 3: Получить все продукты
    const getAllProductsResponse = await request.get(
      baseURL + endpoints.productsAll,
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const getAllProductsBody = await getAllProductsResponse.json();

    // Шаг 4: Создать и проверить JSON схему
    await validateResponse(getAllProductsResponse, {
      status: STATUS_CODES.OK,
      schema: getAllProductsSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });

    const actualProductData = createProductBody.Product;

    expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(
      productData
    );

    const id = actualProductData._id;

    const getAllProductResponse = await request.get(
      `${baseURL}${endpoints.productsAll}`,
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Шаг 5: Проверить статус
    expect(getAllProductsResponse.status()).toBe(STATUS_CODES.OK);
    const getAllProductResponseBody = await getAllProductResponse.json();
    validateJsonSchema(getAllProductResponseBody, getAllProductsSchema);

    // Шаг 6: Проверить, что в массиве тела ответа есть созданный продукт
    const haveNewProduct = getAllProductResponseBody.Products.some(
      (product: IProductFromResponse) => product._id === id
    );
    expect.soft(haveNewProduct).toBe(true);

    // Шаг 7: Проверить поля IsSuccess и ErrorMessage
    expect(getAllProductsBody.IsSuccess).toBe(true);
    expect(getAllProductsBody.ErrorMessage).toBeNull();
  });
});
