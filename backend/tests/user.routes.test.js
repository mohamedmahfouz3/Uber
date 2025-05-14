const request = require("supertest");
const server = require("../index"); // Import the server instance

describe("Auth API Tests", () => {
  let token;

  it("should register a new user", async () => {
    const res = await request(server)
      .post("/users/register")
      .send({
        fullName: {
          firstName: "John",
          lastName: "Doe",
        },
        email: "john.doe@example.com",
        password: "Password123",
        address: "123 Main Street",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("token");

    token = res.body.token; // Save the token for further tests
  });

  it("should login the user", async () => {
    const res = await request(server).post("/users/login").send({
      email: "john.doe@example.com",
      password: "Password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Login successful");
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("token");
  });

  it("should fail to login with incorrect password", async () => {
    const res = await request(server).post("/users/login").send({
      email: "john.doe@example.com",
      password: "WrongPassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });

  afterAll(async () => {
    await server.close();
  });
});
