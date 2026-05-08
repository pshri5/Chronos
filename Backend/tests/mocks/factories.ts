import { User } from "../../src/models/user.model.js";
import { Job } from "../../src/models/job.model.js";
import jwt from "jsonwebtoken";

export const createMockUser = async (overrides = {}) => {
  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    ...overrides,
  });
  return user;
};

export const createMockJob = async (userId: any, overrides = {}) => {
  return await Job.create({
    userId,
    name: "Test Job",
    jobType: "one-time",
    scheduledAt: new Date(),
    ...overrides,
  });
};

export const generateToken = (userId: any) => {
  const secret = process.env.ACCESS_TOKEN_SECRET || "test_secret";
  return jwt.sign({ id: userId }, secret, { expiresIn: "1d" });
};
