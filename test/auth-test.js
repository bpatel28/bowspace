let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

let should = chai.should();
chai.use(chaiHttp);

/**
 * test auth route
 */
describe('POST /rest/auth', () => {
    //successful login
    it('it should get jwt token with status "success"', (done) => {
        //credentials from database defined in SP
        let data = {
            UserName : "b.patel405",
            Password : "1234",
        };
        chai.request(server)
            .post('/rest/auth')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.be.a('object');
                res.body.should.have.property('Login');
                res.body.should.have.property('Status');
                res.body.should.have.property('Status').eql('Success');
                res.body.Login.should.have.property('Token');
                res.body.Login.should.have.property('UserId');
                res.body.Login.should.have.property('UserName');
                res.body.Login.should.have.property('Email');
                res.body.Login.should.have.property('FirstName');
                res.body.Login.should.have.property('LastName');
                done();
            });
    });
    //access denied test
    it('it should not get jwt token and get status "access-denied"', (done) => {
        //wrong password
        let login = {
            UserName: "b.patel405",
            Email: "b.patel405@mybvc.ca",
            Password: "123456789",
        };
        chai.request(server)
            .post('/rest/auth')
            .send(login)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.have.be.a('object');
                res.body.should.have.property('Status');
                res.body.should.have.property('Status').eql('access-denied');
                res.body.should.have.property('Guidance').eql('Access denied (A4483).');
                done();
            });
    });
});

/**
 * Test Middlewear
 */
describe('{middlewear}', () => {
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

    //request to default path
    describe('GET /', () => {
        it('it should get default response message', (done) => {
            chai.request(server)
                .get('/')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.be.a('object');
                    res.body.should.have.property('Message').eql('Welcome to the BowSpace API');
                    done();
                });
        });
    });
});