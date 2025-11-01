import request from "supertest";
import app from "../src/server.js";

describe("Auth Callback API Tests", () => {
  test("Missing access_token returns 400", async () => {
    const res = await request(app).get("/api/auth/callback");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Missing access token");
  });

  test("Callback with access_token returns success", async () => {
    const res = await request(app).get("/api/auth/callback?access_token=dummy_token");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
