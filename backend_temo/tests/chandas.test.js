import request from "supertest";
import app from "../src/server.js";

describe("Chandas API Tests", () => {
  // ✅ Test fetching all chandas
  test("GET /api/chandas should return all chandas", async () => {
    const res = await request(app).get("/api/chandas");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // ✅ Test analyzing a shloka (Latin input)
  test("POST /api/chandas/analyze (Latin input) should return analysis", async () => {
    const res = await request(app)
      .post("/api/chandas/analyze")
      .send({ shloka: "yadā yadā hi dharmasya glānir bhavati bhārata" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.analysis).toHaveProperty("input");
    expect(res.body.analysis.input).toHaveProperty("devanagari");
    expect(res.body.analysis.input).toHaveProperty("latin");
    expect(res.body.analysis).toHaveProperty("identifiedChandas");
    expect(res.body.analysis).toHaveProperty("explanation");
  });

  // ✅ Test analyzing a shloka (Devanagari input)
  test("POST /api/chandas/analyze (Devanagari input) should return analysis", async () => {
    const res = await request(app)
      .post("/api/chandas/analyze")
      .send({ shloka: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.analysis.input).toHaveProperty("devanagari");
    expect(res.body.analysis.input).toHaveProperty("latin");
  });

  // ❌ Missing shloka input
  test("POST /api/chandas/analyze with no input should return 400", async () => {
    const res = await request(app).post("/api/chandas/analyze").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Missing shloka text ❌");
  });
});
