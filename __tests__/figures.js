const db = require("../db");
const request = require("supertest");
const app = require("../app");
const { AUTH_URI, FIGURE_URI } = require("../constants");

describe("figures", () => {
  beforeAll(() => {
    db.connect();
  });

  afterAll((done) => {
    db.disconnect(done);
  });

  let tokenNoBearerPrefix;

  describe("upload", () => {
    it("registers a tempory user successfully", (done) => {
      const mockedUser = {
        username: "upload",
        email: "upload@test.com",
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
          expect(username).toBe("upload");

          done();
        })
        .catch((err) => {
          console.log(err);
          done(err);
        });
    });

    it("returns error when missing blockKey", (done) => {
      request(app)
        .post(`${FIGURE_URI}/upload`)
        .auth(tokenNoBearerPrefix, { type: "bearer" })
        .attach("test", `${__dirname}/data/test.jpeg`)
        .expect(403)
        .then((res) => {
          const { error } = res.body;
          expect(error).toBe("Please add a blockKey");
          done();
        })
        .catch((err) => {
          console.error(err);
          done(err);
        });
    });

    it("uploads successfully", (done) => {
      request(app)
        .post(`${FIGURE_URI}/upload`)
        .auth(tokenNoBearerPrefix, { type: "bearer" })
        .attach("test", `${__dirname}/data/test.jpeg`)
        .field("blockKey", "blockKey")
        .expect(201)
        .then((res) => {
          const { success } = res.body;
          expect(success).toBe(true);
          done();
        })
        .catch((err) => {
          console.error(err);
          done(err);
        });
    });

    it("retrives image successfully", (done) => {
      request(app)
        .get(`${FIGURE_URI}/blockKey`)
        .auth(tokenNoBearerPrefix, { type: "bearer" })
        .expect(200)
        .then((res) => {
          done();
        })
        .catch((err) => {
          console.error(err);
          done(err);
        });
    });
  });
});
