const app = require('../index');
const chai = require('chai')
const expect = chai.expect;
const request = require('supertest');
const config = require('../config');

describe('Route tests', () => {

    describe('Get / route', () => {
        it('should return message', done => {
            request(app)
                .get('/')
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.message).to.eq(`Welcome to ${config.bankName}`);
                    done();
                });
        });
    });
});