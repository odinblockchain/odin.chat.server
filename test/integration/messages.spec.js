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
            .get('/messages', {
                deviceId: 123,
                registrationId: 456,
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).to.deep.equal([]);
                done();
            })
            .catch((err) => done(err))
    });

});
