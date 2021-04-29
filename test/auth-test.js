let chai = require("chai");
let chaiHttp = require("chai-http");

const server = require("../server");
const config = require("../lib/config/config"); // get our config file
const { dbValidateUser } = require("../lib/utils/user-utils");

chai.should();
chai.use(chaiHttp);

describe("POST /rest/auth", () => {
  let user = null;
  const login = {
    Email: config.testLogin.Email,
    UserName: config.testLogin.UserName,
    Password: config.testLogin.Password,
  };

  beforeEach((done) => {
    dbValidateUser(login)
      .then((result) => (user = result))
      .catch()
      .finally(() => done());
  });

  // if have valid credential then run status 200 test else status 500 test.
  it("Validate test user login.", (done) => {
    if (user) {
      chai
        .request(server)
        .post("/rest/auth")
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.be.a("object");
          res.body.should.have.property("Status");
          res.body.should.have.property("Status").eql("Success");
          res.body.should.have.property("Token");
          res.body.should.have.property("UserId");
          res.body.should.have.property("UserId").eql(user.UserId);
          res.body.should.have.property("UserName");
          res.body.should.have.property("UserName").eql(user.UserName);
          res.body.should.have.property("Email");
          res.body.should.have.property("Email").eql(user.Email);
          res.body.should.have.property("FirstName");
          res.body.should.have.property("FirstName").eql(user.FirstName);
          res.body.should.have.property("LastName");
          res.body.should.have.property("LastName").eql(user.LastName);
          res.body.should.have.property("MiddleName");
          res.body.should.have.property("MiddleName").eql(user.MiddleName);
          res.body.should.have.property("ValidFrom");
          done();
        });
    } else {
      chai
        .request(server)
        .post("/rest/auth")
        .send(login)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have.be.a("object");
          res.body.should.have.property("Status");
          res.body.should.have.property("Status").eql("Failed");
          res.body.should.have
            .property("Guidance")
            .eql("Access denied (A4483).");
          done();
        });
    }
  });
});
