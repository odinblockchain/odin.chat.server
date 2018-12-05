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

            it('should validate missing body param [deviceId]', function () {
                request(app)
                    .put('/keys')
                    .send({
                            "registrationId": 456,
                            "identityKey": "abcdef",
                            "signedPreKey": {
                                "id": 666,
                                "key": "abcdef",
                                "signature": "abcdef"
                            },
                            "preKey": {
                                "id": 444,
                                "key": "abcdef"
                            }
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

    });
});
