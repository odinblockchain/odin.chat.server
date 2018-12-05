const Joi = require('joi');

//TODO tighten up once we support multiple preKeys

module.exports = {
    options: {
        allowUnknownBody: false,
        allowUnknownQuery: false,
        allowUnknownParams: false
    },
    query: {
        deviceId: Joi.number().integer().required(),
        registrationId: Joi.number().integer().required(),
        identityKey: Joi.string().required(),
        signedPreKey:
            Joi.object()
                .keys({
                    id: Joi.number().required(),
                    key: Joi.string().required(),
                    signature: Joi.string().required()
                })
                .required(),
        preKey:
            Joi.object()
                .keys({
                    id: Joi.number().required(),
                    key: Joi.string().required()
                })
                .required(),

    }
};
