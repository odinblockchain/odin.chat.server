const request = require('supertest');
const expect = require('chai').expect;

const {
    validateMissingQueryElement,
    validateMissingBodyElement
} = require("../assertionutils");

const app = require('../../api/OSMServer');

const db = require('../../api/database');
const flushDb = require("../testUtils").flushDb;

const DEFAULT_REGISTRATION = {
	"address": {
    "name": "user@coin",
    "registrationId": 1111,
    "deviceId": 123
	},
	"identityPubKey": "Xabc123",
	"signedPreKey": {
    "id": 666,
    "pubKey": "abcdef",
    "signature": "abcdef"
	},
	"publicPreKeys": [
    {
      "id": 100,
      "pubKey": "aaaa"
    },
    {
      "id": 101,
      "pubKey": "bbbbb"
    }
	]
};

describe('/keys integration tests', function () {

  beforeEach(async () => {
    await flushDb(db);
  });

  it('should return 404 and empty list on unknown keys', function (done) {
    request(app)
    .get('/keys')
    .query({
      user: 'user@coin'
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
    .send(DEFAULT_REGISTRATION)
    .expect(200)
    .then(response => {
      expect(response.body).to.deep.equal({ count: 2 });
      done();
    })
    .catch((err) => done(err));
  });

  it('should remove preKey once requested', function (done) {
    const api = request(app);

    api.put('/keys')
    .send(DEFAULT_REGISTRATION)
    .expect(200)
    .then(response => {
      // Count of 2 keys registered
      expect(response.body).to.deep.equal({ count: 2 });

      // try get some
      return api
      .get('/keys')
      .query({
        user: DEFAULT_REGISTRATION.address.name
      })
      .expect(200)
      .then(response => {
        expect(response.body).to.deep.equal({
          address: {
            name: DEFAULT_REGISTRATION.address.name
          },
          identityPubKey: DEFAULT_REGISTRATION.identityPubKey,
          signedPreKey: {
            id: DEFAULT_REGISTRATION.signedPreKey.id,
            pubKey: DEFAULT_REGISTRATION.signedPreKey.pubKey,
            signature: DEFAULT_REGISTRATION.signedPreKey.signature
          },
          publicPreKey: {
            id: 101,
            pubKey: "bbbbb"
          }
        });

        return request(app)
        .get('/keys/count')
        .query({
          user: DEFAULT_REGISTRATION.address.name
        })
        .expect(200)
        .then(response => {
          // Expect to have come down to 1
          expect(response.body).to.deep.equal({ count: 1 });
          done();
        });
      });
    })
    .catch((err) => done(err));
  });

  describe('validation', function () {
    describe('GET keys', function () {
      it('should validate missing query param [user]', function (done) {
        request(app)
        .get('/keys')
        .query({
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => {
          validateMissingQueryElement(response, "user");
          return done();
        })
        .catch((err) => done(err));
      });

      // it('should validate missing query param [registrationId]', function (done) {
      //   request(app)
      //   .get('/keys')
      //   .query({
      //       deviceId: 123,
      //   })
      //   .expect('Content-Type', /json/)
      //   .expect(400)
      //   .then(response => {
      //       validateMissingQueryElement(response, "registrationId");
      //       return done();
      //   })
      //   .catch((err) => done(err));
      // });
    });

    describe('PUT keys', function () {
      it('should validate missing body param [address.name]', function (done) {
        let completeRequest = DEFAULT_REGISTRATION;
        delete completeRequest.address.name;

        request(app)
        .put('/keys')
        .send(completeRequest)
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => {
          validateMissingBodyElement(response, "name");
          return done();
        })
        .catch((err) => done(err));
      });
    });

    describe('GET count keys', function () {
      it('should validate missing query param [user]', function (done) {
        request(app)
        .get('/keys/count')
        .query({
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => {
          validateMissingQueryElement(response, "user");
          return done();
        })
      .catch((err) => done(err));
      });

      // it('should validate missing query param [registrationId]', function (done) {
      //   request(app)
      //   .get('/keys/count')
      //   .query({
      //     deviceId: 123,
      //   })
      //   .expect('Content-Type', /json/)
      //   .expect(400)
      //   .then(response => {
      //     validateMissingQueryElement(response, "registrationId");
      //     return done();
      //   })
      //   .catch((err) => done(err));
      // });
    });
  });
});
