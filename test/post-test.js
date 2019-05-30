let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

let should = chai.should();
chai.use(chaiHttp);

/**
 * Test get post
 */
describe('GET /rest/post', () => {

    let token = '';
    //get token first from auth route
    beforeEach((done) => {
        let data = {
            UserName: "b.patel405",
            Password: "1234",
        };
        chai.request(server)
            .post('/rest/auth')
            .send(data)
            .end((err, res) => {
                token = res.body.Login.Token;
                done();
            });
    });

    // all the post
    it('it should get all the post from database', done => {
        chai.request(server)
            .get('/rest/post')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.be.a('object');
                res.body.should.have.property('Posts');
                res.body.Posts.should.be.a('array');
                res.body.should.have.property('Status').eql('Success');
                done();
            });
    });

    //post for receiverId 1000
    it('it should get all the post for User 1000 from database', done => {
        let data = {
            ReceiverId : 1000,
        }
        chai.request(server)
            .get('/rest/post')
            .set('x-access-token', token)
            .query(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.be.a('object');
                res.body.should.have.property('Posts');
                res.body.Posts.should.be.a('array');
                let sameuser = false;
                res.body.Posts.forEach(post => {
                    sameuser = (post.ReceiverId === data.ReceiverId);
                    if (sameuser === false) {
                        return;
                    }
                });
                sameuser.should.equal(true);
                res.body.should.have.property('Status').eql('Success');
                done();
            });
    });
});

/**
 * Test create post
 */
describe('PUT /rest/post', () => {

    let token = '';
    //get token first from auth route
    beforeEach((done) => {
        let data = {
            UserName: "b.patel405",
            Password: "1234",
        };
        chai.request(server)
            .post('/rest/auth')
            .send(data)
            .end((err, res) => {
                token = res.body.Login.Token;
                done();
            });
    });

    // create new post
    it('it should create new post and get back postid', done => {
        let data = {
            SenderId : 1000,
            ReceiverId : 1002,
        };
        chai.request(server)
            .put('/rest/post')
            .set('x-access-token', token)
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.be.a('object');
                res.body.should.have.property('PostId');
                res.body.should.have.property('Status').eql('Success');
                done();
            });
    });
});

/**
 * Delete Post Test
 */
describe('DELETE /rest/post', () => {

    let token = '';
    //get token first from auth route
    beforeEach((done) => {
        let data = {
            UserName: "b.patel405",
            Password: "1234",
        };
        chai.request(server)
            .post('/rest/auth')
            .send(data)
            .end((err, res) => {
                token = res.body.Login.Token;
                done();
            });
    });

    //create new post and set postID
    let PostId = '';
    beforeEach(done => {
        let data = {
            SenderId: 1000,
            ReceiverId: 1002,
        };
        chai.request(server)
            .put('/rest/post')
            .set('x-access-token', token)
            .send(data)
            .end((err, res) => {
                PostId = res.body.PostId;
                done();
            });
    });

    // delete newly created post
    it('it should delete post and get back deleted postId', done => {

        chai.request(server)
            .delete('/rest/post')
            .set('x-access-token', token)
            .send({PostId})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.be.a('object');
                res.body.should.have.property('DeletedPostId').eql(PostId);
                res.body.should.have.property('Status').eql('Success');
                done();
            });
    });
});