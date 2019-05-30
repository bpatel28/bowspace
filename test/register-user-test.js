let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

let should = chai.should();
chai.use(chaiHttp);

/**
 * Test Register account path
 */

describe('PUT /rest/register-user', () => {
    //successful registration
    it('it should register new account and give back userid', done => {

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
            FirstName : randomName,
            LastName : 'Patel',
            Email :  randomName + randomChars + '@hotmail.com',
            UserName: randomName + randomChars,
            Password : '1234',
        }
        chai.request(server)
            .put('/rest/register-user')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.be.a('object');
                res.body.should.have.property('UserId');
                res.body.should.have.property('Status').eql('Success');
                done();
            });
    });

    //unsuccessful registration
    it('it should not register new account and give back error', done => {
        //user data from database 
        let data = {
            FirstName: 'Brijesh',
            LastName: 'Patel',
            Email: 'b.patel405@mybvc.ca',
            UserName: 'b.patel405',
            Password: '1234',
        }
        chai.request(server)
            .put('/rest/register-user')
            .send(data)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.have.be.a('object');
                res.body.should.have.property('Guidance');
                res.body.should.have.property('Status').eql('Error');
                done();
            });
    });
});