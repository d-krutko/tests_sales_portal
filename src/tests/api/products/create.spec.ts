import test, { expect } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { credentials } from "config/env";
import { generateProductData } from "data/products/generateProductData";
import { loginSchema } from "data/schemas/login.schema";
import { createProductSchema } from "data/schemas/products/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import _ from "lodash";
import { validateJsonSchema } from "utils/schema.utils";
import { validateResponse } from "utils/validateResponse.utils";

const { baseURL, endpoints } = apiConfig;

test.describe("[API] [Sales Portal] [Products]", () => {
  let id = "";
  let token = "";

  test.afterEach(async ({ request }) => {
    const response = await request.delete(
      `${baseURL}${endpoints.products}/${id}`,
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.status()).toBe(STATUS_CODES.DELETED);
  });

  test("Create Product", async ({ request }) => {
    const loginResponse = await request.post(baseURL + endpoints.login, {
      data: credentials,
      headers: {
        "content-type": "application/json",
      },
    });

    //const createUserBody = await loginResponse.json();
    await validateResponse(loginResponse, {
      status: STATUS_CODES.OK,
      schema: loginSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });

    const headers = loginResponse.headers();
    token = headers["authorization"]!;
    expect(token).toBeTruthy();

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

    const actualProductData = createProductBody.Product;

    expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(
      productData
    );

    id = actualProductData._id;
  });
});
