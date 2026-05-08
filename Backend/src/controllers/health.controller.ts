import { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.js";

export const checkHealth = (req: Request, res: Response) => {
  return res.status(200).json(
    new apiResponse(200, {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }, "Server is healthy")
  );
};
