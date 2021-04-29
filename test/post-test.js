let chai = require("chai");
let chaiHttp = require("chai-http");
const { expect } = require("chai");

const server = require("../server");
const User = require("../lib/model/User");
const { dbGetPosts, dbAddPost } = require("../lib/utils/post-utils");

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

// Test for create post route
describe("PUT /rest/post", () => {
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

  it("it should create new post.", (done) => {
    let data = {
      SenderId: user.UserId,
      ReceiverId: user.UserId,
      PostHtml: "TEST MESSAGE",
    };
    chai
      .request(server)
      .put("/rest/post")
      .set("x-access-token", user.Token)
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a("object");
        res.body.should.have.property("PostId");
        res.body.should.have.property("Sender");
        res.body.Sender.should.have.property("UserId").eql(data.SenderId);
        res.body.should.have.property("Receiver");
        res.body.Receiver.should.have.property("UserId").eql(data.ReceiverId);
        res.body.should.have.property("PostHtml");
        res.body.should.have.property("PostHtml").eql(data.PostHtml);
        res.body.should.have.property("Status").eql("Success");
        done();
      });
  });
});

//  test to filter and collect post
describe("GET /rest/post", () => {
  let user = null;
  let expectedPosts = [];
  let keywords = "Hello";

  // get token before test to pass middleware
  beforeEach((done) => {
    chai
      .request(server)
      .post("/rest/auth")
      .send({ Email: testData.Email, Password: testData.Password })
      .end((err, loginRes) => {
        if (!err && loginRes.body.Status === "Success") {
          user = new User(loginRes.body);
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
            });
        }
      });
    done();
  });

  // get token before test to pass middleware
  beforeEach((done) => {
    dbGetPosts({ Keywords: keywords })
      .then((result) => {
        expectedPosts = result;
      })
      .catch()
      .finally(() => done());
  });

  it("it should get all post with given keywords.", (done) => {
    chai
      .request(server)
      .get("/rest/post")
      .set("x-access-token", user.Token)
      .query({ Keywords: keywords })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a("object");
        res.body.should.have.property("Posts");
        res.body.should.have.property("Status").eql("Success");
        res.body.Posts.should.be.a("array");
        expect(res.body.Posts).to.have.length(expectedPosts.length);
        done();
      });
  });
});

// test for deleting post.
describe("DELETE /rest/post", () => {
  let user = null;
  let postId = -1;

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

  // get token before test to pass middleware
  beforeEach((done) => {
    let data = {
      SenderId: user.UserId,
      ReceiverId: user.UserId,
      PostHtml: "TEST MESSAGE",
    };

    dbAddPost(data)
      .then((result) => {
        postId = result.PostId;
      })
      .catch(console.log)
      .finally(() => done());
  });

  it("it should delete given PostId.", (done) => {
    chai
      .request(server)
      .delete("/rest/post")
      .set("x-access-token", user.Token)
      .send({ PostId: postId })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.be.a("object");
        res.body.should.have.property("PostId");
        res.body.should.have.property("PostId").eql(postId);
        res.body.should.have.property("Status").eql("Success");
        done();
      });
  });
});
