import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from "supertest";
import app from "../../src/app.js";
import mongoose from "mongoose";
import { connectDB, disconnectDB, clearDatabase } from "../test-db-setup.js";
import { createMockUser, generateToken } from "../mocks/factories.js";
import { Job } from "../../src/models/job.model.js";

describe("Job Controller Integration Tests", () => {
  let user: any;
  let token: string;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    user = await createMockUser();
    token = generateToken(user._id);
  });

  describe("POST /api/v1/jobs", () => {
    it("should create a job successfully", async () => {
      const response = await request(app)
        .post("/api/v1/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Test Job",
          scheduledAt: new Date().toISOString(),
          jobType: "one-time",
          payload: { key: "value" }
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.name).toBe("Test Job");
      expect(response.body.message).toBe("Job created successfully");
    });

    it("should return 400 if name or scheduledAt is missing", async () => {
      const response = await request(app)
        .post("/api/v1/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          jobType: "one-time"
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Name and scheduledAt are required");
    });

    it("should return 400 for invalid jobType", async () => {
      const response = await request(app)
        .post("/api/v1/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Test Job",
          scheduledAt: new Date().toISOString(),
          jobType: "invalid-type"
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Invalid jobType");
    });

    it("should return 400 for recurring jobs without cronExpression", async () => {
      const response = await request(app)
        .post("/api/v1/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Recurring Job",
          scheduledAt: new Date().toISOString(),
          jobType: "recurring"
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("cronExpression is required for recurring jobs");
    });
  });

  describe("GET /api/v1/jobs", () => {
    it("should fetch jobs for the authenticated user", async () => {
      await Job.create({
        userId: user._id,
        name: "Job 1",
        scheduledAt: new Date(),
        status: "pending"
      });

      const response = await request(app)
        .get("/api/v1/jobs")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.jobs).toHaveLength(1);
      expect(response.body.data.jobs[0].name).toBe("Job 1");
    });
  });

  describe("GET /api/v1/jobs/:jobId", () => {
    it("should return 404 for non-existent job", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .get(`/api/v1/jobs/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Job not found");
    });

    it("should return 400 for invalid ObjectId", async () => {
      const response = await request(app)
        .get("/api/v1/jobs/invalid-id")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid job ID");
    });
  });
});
