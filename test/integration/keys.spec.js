const request = require('supertest');
const expect = require('chai').expect;

const {
    validateMissingQueryElement,
    validateMissingBodyElement
} = require("../assertionutils");

const app = require('../../api/OSMServer');

const db = require('../../api/database');
const flushDb = require("../testUtils").flushDb;

describe('/keys integration tests', function () {

    beforeEach(async () => {
        await flushDb(db);
    });

    it('should return 404 and empty list on unknown keys', function (done) {
        request(app)
            .get('/keys')
            .query({
                deviceId: 123,
                registrationId: 456,
            })
            .expect(404)
            .then(response => {
                expect(response.body).to.deep.equal({});
                done();
            })
            .catch((err) => done(err));
    });

    it('should return 200 and count of keys stored successfully', function (done) {
        request(app)
            .put('/keys')
            .send({
                deviceId: 124,
                registrationId: 456,
                identityKey: "abcdef",
                signedPreKey: {
                    keyId: 666,
                    publicKey: "abcdef",
                    signature: "abcdef"
                },
                preKeys: [
                    {
                        keyId: 444,
                        publicKey: "aaaa"
                    },
                    {
                        keyId: 555,
                        publicKey: "bbbbb"
                    }
                ]
            })
            .expect(200)
            .then(response => {
                expect(response.body).to.deep.equal({count: 2});
                done();
            })
            .catch((err) => done(err));
    });

    describe('validation', function () {
        describe('GET keys', function () {
            it('should validate missing query param [deviceId]', function (done) {
                request(app)
                    .get('/keys')
                    .query({
                        registrationId: 456,
                    })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then(response => {
                        validateMissingQueryElement(response, "deviceId");
                        return done();
                    })
                    .catch((err) => done(err));
            });

            it('should validate missing query param [registrationId]', function (done) {
                request(app)
                    .get('/keys')
                    .query({
                        deviceId: 123,
                    })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then(response => {
                        validateMissingQueryElement(response, "registrationId");
                        return done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('PUT keys', function () {
            it('should validate missing body param [deviceId]', function (done) {
                request(app)
                    .put('/keys')
                    .send({
                            "registrationId": 456,
                            "identityKey": "abcdef",
                            "signedPreKey": {
                                "keyId": 666,
                                "publicKey": "abcdef",
                                "signature": "abcdef"
                            },
                            "preKeys": [
                                {
                                    "keyId": 444,
                                    "publicKey": "aaaa"
                                },
                                {
                                    "keyId": 555,
                                    "publicKey": "bbbbb"
                                }
                            ]
                        }
                    )
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then(response => {
                        validateMissingBodyElement(response, "deviceId");
                        return done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('GET count keys', function () {
            it('should validate missing query param [deviceId]', function (done) {
                request(app)
                    .get('/keys/count')
                    .query({
                        registrationId: 456,
                    })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then(response => {
                        validateMissingQueryElement(response, "deviceId");
                        return done();
                    })
                    .catch((err) => done(err));
            });

            it('should validate missing query param [registrationId]', function (done) {
                request(app)
                    .get('/keys/count')
                    .query({
                        deviceId: 123,
                    })
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .then(response => {
                        validateMissingQueryElement(response, "registrationId");
                        return done();
                    })
                    .catch((err) => done(err));
            });
        });
    });
});
