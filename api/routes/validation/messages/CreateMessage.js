const Joi = require('joi');

module.exports = {
    options: {
        allowUnknownBody: false,
        allowUnknownQuery: false,
        allowUnknownParams: false
    },
    body: {
        destinationDeviceId: Joi.number().integer().required(),
        destinationRegistrationId: Joi.number().integer().required(),
        ciphertextMessage: Joi.string().required()
    }
};
