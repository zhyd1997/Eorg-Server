const db = require("../db");
const request = require("supertest");
const app = require("../app");
const { AUTH_URI } = require("../constants");

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
        .post(`${AUTH_URI}/register`)
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

  describe("login", () => {
    it("throws an error when no email", (done) => {
      const mockedUser = { username: "test" };

      request(app)
        .post(`${AUTH_URI}/login`)
        .send(mockedUser)
        .expect(400)
        .then((res) => {
          const { error } = res.body;
          expect(error).toBe("Please provide an email and password");
          done();
        })
        .catch((err) => {
          console.log(err);
          done(err);
        });
    });

    it("throws an error when no password", (done) => {
      const mockedUser = { username: "test", email: "test@test.com" };

      request(app)
        .post(`${AUTH_URI}/login`)
        .send(mockedUser)
        .expect(400)
        .then((res) => {
          const { error } = res.body;
          expect(error).toBe("Please provide an email and password");
          done();
        })
        .catch((err) => {
          console.log(err);
          done(err);
        });
    });

    it("throws an error when user not found", (done) => {
      const mockedUser = {
        username: "test1",
        email: "test1@test.com",
        password: "test123",
      };

      request(app)
        .post(`${AUTH_URI}/login`)
        .send(mockedUser)
        .expect(404)
        .then((res) => {
          const { error } = res.body;

          expect(error).toBe("User not found");

          done();
        })
        .catch((err) => {
          console.log(err);
          done(err);
        });
    });
  });
});
