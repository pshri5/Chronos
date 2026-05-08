import { describe, it, expect } from 'vitest';
import { apiResponse } from "../../src/utils/apiResponse.js";

describe("apiResponse Utility", () => {
  it("should set success to true for status codes < 400", () => {
    const response = new apiResponse(200, { data: "test" }, "Success");
    expect(response.success).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(response.data).toEqual({ data: "test" });
    expect(response.message).toBe("Success");
  });

  it("should set success to false for status codes >= 400", () => {
    const response = new apiResponse(400, null, "Bad Request");
    expect(response.success).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(response.message).toBe("Bad Request");
  });
});
