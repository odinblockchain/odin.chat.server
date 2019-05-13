const Joi = require('joi');

const preKeySchema = Joi.object()
                    .keys({
                      id: Joi.number().required(), //keyId
                      pubKey: Joi.string().required() //publicKey
                    })
                    .required();

module.exports = {
  options: {
    allowUnknownBody: false,
    allowUnknownQuery: false,
    allowUnknownParams: false
  },
  body: {
    address:
      Joi.object()
      .keys({
        name: Joi.string().required(),
        deviceId: Joi.number().required(),
        registrationId: Joi.number().required()
      }).required(),
    identityPubKey: Joi.string().required(), //identityKey
    signedPreKey:
      Joi.object()
      .keys({
        id: Joi.number().required(), //keyId
        pubKey: Joi.string().required(), //publicKey
        signature: Joi.string().required()
      }).required(),
    preKeys:
      Joi.array()
      .items(preKeySchema).required().min(1),
    fcmToken: Joi.string().allow('').optional()
  }
    // body: {
    //     deviceId: Joi.number().integer().required(),
    //     accountHash: Joi.string().required(),
    //     registrationId: Joi.number().integer().required(),
    //     identityKey: Joi.string().required(),

    //     // A single master signed key
    //     signedPreKey:
    //         Joi.object()
    //             .keys({
    //                 keyId: Joi.number().required(),
    //                 publicKey: Joi.string().required(),
    //                 signature: Joi.string().required()
    //             })
    //             .required(),

    //     // List of preKeys
    //     preKeys: Joi.array().items(preKeySchema).required().min(1),

    // }
};
