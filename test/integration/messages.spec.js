const request = require('supertest');
const expect = require('chai').expect;

const app = require('../../api/OSMServer');

const db = require('../../api/database');
const flushDb = require("../testUtils").flushDb;

describe('/messages integration tests', function () {

    beforeEach(async () => {
        await flushDb(db);
    });

    it('should return 200 and empty body when no messages found for keys', function (done) {
        request(app)
            .get('/messages')
            .query({
                deviceId: 123,
                registrationId: 456,
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).to.deep.equal([]);
                done();
            })
            .catch((err) => done(err));
    });

    it('should validate missing param [deviceId]', function (done) {
        request(app)
            .get('/messages')
            .query({
                registrationId: 456,
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(response => {
                expect(response.body.errors).to.deep.equal([
                    {
                        "field": [
                            "deviceId"
                        ],
                        "location": "query",
                        "messages": [
                            "\"deviceId\" is required"
                        ],
                        "types": [
                            "any.required"
                        ]
                    }
                ]);
                return done();
            })
            .catch((err) => done(err));
    });

    it('should validate missing param [registrationId]', function (done) {
        request(app)
            .get('/messages')
            .query({
                deviceId: 123,
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(response => {
                expect(response.body.errors).to.deep.equal([
                    {
                        "field": [
                            "registrationId"
                        ],
                        "location": "query",
                        "messages": [
                            "\"registrationId\" is required"
                        ],
                        "types": [
                            "any.required"
                        ]
                    }
                ]);
                return done();
            })
            .catch((err) => done(err));
    });

});
