import { describe, it, expect, vi } from 'vitest';
import { asyncHandler } from "../../src/utils/asyncHandler.js";

describe("asyncHandler Utility", () => {
  it("should execute the provided function successfully", async () => {
    const mockFn = async (req: any, res: any, next: any) => {
      res.status(200).json({ success: true });
    };
    
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    const handler = asyncHandler(mockFn);
    await handler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("should catch errors and send a response", async () => {
    const mockFn = async () => {
      throw new Error("Test Error");
    };
    
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    const handler = asyncHandler(mockFn);
    await handler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Test Error"
    });
  });

  it("should use error code if available", async () => {
    const mockFn = async () => {
      const error: any = new Error("Custom Error");
      error.code = 403;
      throw error;
    };
    
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    const handler = asyncHandler(mockFn);
    await handler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Custom Error"
    });
  });
});
