const request = require('supertest');
const expect = require('chai').expect;

const app = require('../../api/OSMServer');

const db = require('../../api/database');
const flushDb = require("../testUtils").flushDb;

describe('/keys integration tests', function () {

    beforeEach(async () => {
        await flushDb(db);
    });

    it('should return 404 and empty list on unknown keys', function (done) {
        request(app)
            .get('/keys', {
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

});
