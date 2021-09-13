const db = require("../db");
const request = require("supertest");
const app = require("../app");

describe("auth", () => {
  beforeAll(() => {
    db.connect();
  });

  afterAll((done) => {
    db.disconnect(done);
  });

  describe("register", () => {
    it("registers successfully", (done) => {
      const mockedUser = {
        username: "test",
        email: "test@test.com",
        password: "test123",
      };
      request(app)
        .post("/api/v1/auth/register")
        .send(mockedUser)
        .expect(201)
        .then((res) => {
          const { success, token, username } = res.body;

          expect(success).toBe(true);
          expect(token).toBeTruthy();
          expect(username).toBe("test");

          done();
        })
        .catch((err) => {
          console.log(err);
          done(err);
        });
    });
  });
});
