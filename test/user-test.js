let chai = require("chai");
let chaiHttp = require("chai-http");
const { expect } = require("chai");

const server = require("../server");
const config = require("../lib/config/config"); // get our config file
const User = require("../lib/model/User");
const { getUsers } = require("../lib/utils/user-utils");

chai.should();
chai.use(chaiHttp);

// test login info for user.
const testData = {
  FirstName: "test name5",
  MiddleName: "test",
  LastName: "test",
  Email: "test56@test.com",
  UserName: "test145",
  Password: "testPassword@123",
};

// test for registering new user.
describe("PUT /rest/user", () => {
  it("it should register new account and return user info with token and userId.", (done) => {
    /*
            Title: Generate random string / characters in JavaScript
            src: https: //stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
            Author: doubletap, Kenton Varda
         */
    //random name to make unique account
    let randomName = Math.random().toString(26).substring(3);
    let randomChars = Math.random().toString(26).substring(3);

    //user data
    let data = {
      FirstName: randomName,
      LastName: "Any Name",
      MiddleName: "",
      Email: `${randomName}${randomChars}@gmail.com`,
      UserName: `${randomName}${randomChars}`,
      Password: "1234",
    };

    chai
      .request(server)
      .put("/rest/user")
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a("object");
        res.body.should.have.property("Status");
        res.body.should.have.property("Status").eql("Success");
        res.body.should.have.property("Token");
        res.body.should.have.property("UserId");
        res.body.should.have.property("UserName");
        res.body.should.have.property("UserName").eql(data.UserName);
        res.body.should.have.property("Email");
        res.body.should.have.property("Email").eql(data.Email);
        res.body.should.have.property("FirstName");
        res.body.should.have.property("FirstName").eql(data.FirstName);
        res.body.should.have.property("LastName");
        res.body.should.have.property("LastName").eql(data.LastName);
        res.body.should.have.property("MiddleName");
        res.body.should.have.property("MiddleName").eql(data.MiddleName);
        res.body.should.have.property("ValidFrom");
        done();
      });
  });
});

// test for update user information.
describe("POST /rest/user", () => {
  let user = null;

  // get token before test to pass middleware
  beforeEach((done) => {
    chai
      .request(server)
      .post("/rest/auth")
      .send({ Email: testData.Email, Password: testData.Password })
      .end((err, loginRes) => {
        if (!err && loginRes.body.Status === "Success") {
          user = new User(loginRes.body);
          done();
        } else {
          // if user not registered then register.
          chai
            .request(server)
            .put("/rest/user")
            .send(testData)
            .end((err, registerRes) => {
              if (!err && registerRes.body.Status === "Success") {
                user = new User(registerRes.body);
              }
              done();
            });
        }
      });
  });

  it("it should update user information.", (done) => {
    let randomName = Math.random().toString(26).substring(3);
    let randomChars = Math.random().toString(26).substring(3);
    chai
      .request(server)
      .post("/rest/user")
      .set("x-access-token", user.Token)
      .send({
        ...user,
        UserName: randomName + randomChars + "12",
        LastName: randomName + randomChars,
      })
      .end((err, res) => {
        res.body.should.have.be.a("object");
        if (res.body.Status === "Success") {
          res.should.have.status(200);
          res.body.should.have.property("UserId").eql(user.UserId);
          res.body.should.have.property("FirstName").eql(user.FirstName);
          res.body.should.have
            .property("LastName")
            .eql(randomName + randomChars);
          res.body.should.have.property("Email").eql(user.Email);
          res.body.should.have
            .property("UserName")
            .eql(randomName + randomChars + "12");
        } else {
          res.should.have.status(500);
          res.body.should.have.property("Guidance");
          res.body.should.have.property("Status").eql("Failed");
        }
        done();
      });
  });
});

// test to filter and collect user information.
describe("GET /rest/user", () => {
  let user = null;
  let expectedUers = [];

  // get token before test to pass middleware
  beforeEach((done) => {
    chai
      .request(server)
      .post("/rest/auth")
      .send({ Email: testData.Email, Password: testData.Password })
      .end((err, loginRes) => {
        if (!err && loginRes.body.Status === "Success") {
          user = new User(loginRes.body);
          done();
        } else {
          // if user not registered then register.
          chai
            .request(server)
            .put("/rest/user")
            .send(testData)
            .end((err, registerRes) => {
              if (!err && registerRes.body.Status === "Success") {
                user = new User(registerRes.body);
              }
              done();
            });
        }
      });
  });

  beforeEach((done) => {
    getUsers({ Email: testData.Email, Keywords: "patel" })
      .then((result) => (expectedUers = result))
      .catch()
      .finally(() => done());
  });

  it("it should get all list of users from database for given filters", (done) => {
    chai
      .request(server)
      .get("/rest/user")
      .query({ Email: testData.Email, Keywords: "patel" })
      .set("x-access-token", user.Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a("object");
        res.body.should.have.property("Users");
        res.body.Users.should.be.a("array");
        expect(res.body.Users).to.have.length(expectedUers.length);
        res.body.should.have.property("Status").eql("Success");
        done();
      });
  });
});
