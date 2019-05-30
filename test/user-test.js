let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

let should = chai.should();
chai.use(chaiHttp);

/**
 * Test get user route
 */
describe('GET /rest/user', () => {

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

    it('it should get all list of users from database', done => {
        chai.request(server)
            .get('/rest/user')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.be.a('object');
                res.body.should.have.property('Users');
                res.body.Users.should.be.a('array');
                res.body.should.have.property('Status').eql('Success');
                done();
            });
    }); 
});

/**
 * Test update user info route
 */
describe('POST /rest/user', () => {

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

    let userInfo = {

    };

    //get user old info
    beforeEach(done => {
        chai.request(server)
            .get('/rest/user')
            .set('x-access-token', token)
            .end((err, res) => {
                userInfo = res.body;
                done();
            });
    });

    it('it should update user information.', done => {
        let data = {
            UserName : 'b.patel405',
            UserId : 1000
        }
        chai.request(server)
            .post('/rest/user')
            .set('x-access-token', token)
            .send(data)
            .end((err, res) => {
                res.body.should.have.be.a('object');
                if (res.body.Status === 'Success') {
                    res.should.have.status(200);
                    res.body.should.have.property('Status').eql('Success');
                    res.body.should.have.property('UserId').eql(data.UserId);
                    res.body.should.have.property('FirstName').eql(userInfo.FirstName);
                    res.body.should.have.property('LastName').eql(userInfo.LastName);
                    res.body.should.have.property('Email').eql(userInfo.Email);
                    res.body.should.have.property('UserName').eql(data.UserName);
                } else {
                    res.should.have.status(500);
                    res.body.should.have.property('Guidance');
                    res.body.should.have.property('Status').eql('Error');
                }
                done();
            });
    });

    let data = {
        UserId : 1000,
        UserName : 'b.patel405'
    }
    //set info back to default
    afterEach(done => {
        chai.request(server)
            .post('/rest/user')
            .set('x-access-token', token)
            .send(data)
            .end((err, res) => {
                done();
            });
    });
});