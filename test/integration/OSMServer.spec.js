const request = require('supertest');

const app = require('../../api/OSMServer');

describe('OSMServer integration tests', function () {

    it('should return 404 on unknown keys', function (done) {
        request(app)
            .get('/keys', {
                deviceId: 123,
                registrationId: 456,
            })
            .expect(404)
            .end(function (err, res) {
                done(err);
            });
    });
    
});
