require("dotenv").config();

const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { ObjectId } = require("mongodb");

const { createApp } = require("../app");

function createMockCollections() {
  const storedUsers = [];

  const users = {
    async findOne(query) {
      return (
        storedUsers.find((user) => user.username === query.username) ?? null
      );
    },

    async insertOne(user) {
      const insertedId = new ObjectId();

      storedUsers.push({
        _id: insertedId,
        ...user,
      });

      return { insertedId };
    },
  };

  const habits = {};
  const habitEntries = {};

  return {
    users,
    habits,
    habitEntries,
  };
}

test("POST /api/register creates a new user", async () => {
  const collections = createMockCollections();
  const app = createApp(collections);

  const response = await request(app).post("/api/register").send({
    username: "testuser",
    password: "test123",
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.username, "testuser");
  assert.ok(response.body._id);
});

test("POST /api/register rejects duplicate username", async () => {
  const collections = createMockCollections();
  const app = createApp(collections);

  await request(app).post("/api/register").send({
    username: "testuser",
    password: "test123",
  });

  const response = await request(app).post("/api/register").send({
    username: "testuser",
    password: "anotherPassword",
  });

  assert.equal(response.status, 409);
  assert.equal(response.body.message, "Benutzername ist bereits vergeben");
});

test("POST /api/login logs in registered user", async () => {
  const collections = createMockCollections();
  const app = createApp(collections);

  await request(app).post("/api/register").send({
    username: "testuser",
    password: "test123",
  });

  const response = await request(app).post("/api/login").send({
    username: "testuser",
    password: "test123",
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.username, "testuser");
  assert.ok(response.body.token);
});

test("POST /api/login rejects wrong password", async () => {
  const collections = createMockCollections();
  const app = createApp(collections);

  await request(app).post("/api/register").send({
    username: "testuser",
    password: "test123",
  });

  const response = await request(app).post("/api/login").send({
    username: "testuser",
    password: "wrongPassword",
  });

  assert.equal(response.status, 401);
  assert.equal(response.body.message, "Benutzername oder Passwort ist falsch");
});
