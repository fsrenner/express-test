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

    describe('Transfer route', () => {
        it('should transfer', done => {
            request(app)
                .post('/accounts/transfer')
                .send({
                        "fromAccount": 2,
                        "toAccount": 3,
                        "amount": 25
                })
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.message).to.eq('Success');
                    done();
                });
        });
    });

    describe('deposit route', () => {
        it('should deposit', done => {
            request(app)
                .post('/accounts/deposit')
                .send({
                        "id": 1,
                        "amount": 25
                })
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.balance).to.eq(12370.54);
                    done();
                });
        });
    });
});