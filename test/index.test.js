const app = require('../index');
const chai = require('chai')
const expect = chai.expect;
const request = require('supertest');
const config = require('../config');

describe('Route tests', () => {

    describe('bank name route', () => {
        it('should return bank name welcome message', done => {
            request(app)
                .get('/')
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.message).to.eq(`Welcome to ${config.bankName}`);
                    done();
                });
        });
    });

    describe('status route', () => {
        it('should return status message', done => {
            request(app)
                .get('/status')
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.message).to.eq(`App is running on port ${config.port}`);
                    done();
                });
        });
    });

    describe('accounts route', () => {
        it('should return array of accounts', done => {
            request(app)
                .get('/accounts')
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body).to.be.an('array').that.is.not.empty;
                    done();
                });
        });
    });

    describe('Individual account route', () => {
        it('should return individual account object', done => {
            request(app)
                .get('/accounts/1')
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body).to.be.an('object').that.has.property('id');
                    done();
                });
        });
    });

    describe('All accounts for individual route', () => {
        it('should return all accounts for individual', done => {
            request(app)
                .get('/accounts/jane/doe')
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body).to.be.an('array');
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

    describe('withdrawal route', () => {

        it('should withdraw', done => {
            request(app)
                .post('/accounts/withdraw')
                .send({
                        "id": 1,
                        "amount": 25
                })
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.balance).to.eq(12345.54);
                    done();
                });
        });

        it('should display withdrawal limit message', done => {
            request(app)
                .post('/accounts/withdraw')
                .send({
                        "id": 1,
                        "amount": 1001
                })
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.message).to.eq('The withdrawal limit of an individual account is $1000. You tried to withdraw 1001');
                    done();
                });
        });

        it('should display insufficient funds message', done => {
            request(app)
                .post('/accounts/withdraw')
                .send({
                        "id": 3,
                        "amount": 15746.54
                })
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.message).to.match(/Insufficent funds in savings account/);
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

        it('should display insufficient funds', done => {
            request(app)
                .post('/accounts/transfer')
                .send({
                        "fromAccount": 2,
                        "toAccount": 3,
                        "amount": 25000
                })
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.message).to.match(/Insufficent funds in checking account/);
                    done();
                });
        });
    });
});