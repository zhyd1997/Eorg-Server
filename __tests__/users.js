const db = require("../db");
const request = require("supertest");
const app = require("../app");
const { AUTH_URI, USER_URI } = require("../constants");

describe("users", () => {
  beforeAll(() => {
    db.connect();
  });

  afterAll((done) => {
    db.disconnect(done);
  });

  let tokenNoBearerPrefix;

  describe("getUsers", () => {
    it("registers normal user successfully", (done) => {
      const mockedUser = {
        username: "getUsers",
        email: "getUsers@test.com",
        password: "test123",
      };

      request(app)
        .post(`${AUTH_URI}/register`)
        .send(mockedUser)
        .expect(201)
        .then((res) => {
          const { success, token, username } = res.body;

          tokenNoBearerPrefix = token;

          expect(success).toBe(true);
          expect(token).toBeTruthy();
          expect(username).toBe("getUsers");

          done();
        })
        .catch((err) => {
          console.log(err);
          done(err);
        });
    });

    it("returns an error if user has no admin role", (done) => {
      request(app)
        .get(`${USER_URI}/users`)
        .auth(tokenNoBearerPrefix, { type: "bearer" })
        .expect(403)
        .then((res) => {
          const { error } = res.body;

          expect(error).toBe(
            "User role user is not authorized to access this route"
          );

          done();
        })
        .catch((err) => {
          console.error(err);
          done(err);
        });
    });

    it("registers an admin successfully", (done) => {
      const mockedAdmin = {
        username: "admin",
        email: "admin@admin.com",
        password: "admin123",
        role: "admin",
      };

      request(app)
        .post(`${AUTH_URI}/register`)
        .send(mockedAdmin)
        .expect(201)
        .then((res) => {
          const { success, token, username } = res.body;

          tokenNoBearerPrefix = token;

          expect(success).toBe(true);
          expect(token).toBeTruthy();
          expect(username).toBe("admin");

          done();
        })
        .catch((err) => {
          console.log(err);
          done(err);
        });
    });

    it("returns all users", (done) => {
      request(app)
        .get(`${USER_URI}/`)
        .auth(tokenNoBearerPrefix, { type: "bearer" })
        .expect(200)
        .then((res) => {
          const { success, count } = res.body;

          expect(success).toBe(true);
          expect(count).toBeGreaterThan(1);

          done();
        })
        .catch((err) => {
          console.error(err);
          done(err);
        });
    });
  });
});
