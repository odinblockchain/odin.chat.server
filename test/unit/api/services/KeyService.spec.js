const expect = require('chai').expect;

const KeyService = require('../../../../api/services/KeyService');

// DB should use test-db due to config
const db = require('../../../../api/database');
const flushDb = require("../../../testUtils").flushDb;

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

describe('KeyService tests', function () {

  beforeEach(async () => {
    await flushDb(db);
    this.keyService = new KeyService(db);
  });

  it('should be able to put & getAll the same key', async () => {
    await this.keyService.put(DEFAULT_REGISTRATION);

    let expectedResponse = DEFAULT_REGISTRATION;
    delete expectedResponse.address.registrationId;
    delete expectedResponse.address.deviceId;

    const found = await this.keyService.getAll(DEFAULT_REGISTRATION.address.name);
    expect(found).to.be.deep.equal(expectedResponse);
  });
});
