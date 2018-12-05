const Joi = require('joi');

const preKeySchema = Joi.object()
    .keys({
        id: Joi.number().required(),
        key: Joi.string().required()
    })
    .required();

module.exports = {
    options: {
        allowUnknownBody: false,
        allowUnknownQuery: false,
        allowUnknownParams: false
    },
    body: {
        deviceId: Joi.number().integer().required(),
        registrationId: Joi.number().integer().required(),
        identityKey: Joi.string().required(),

        // A single master signed key
        signedPreKey:
            Joi.object()
                .keys({
                    id: Joi.number().required(),
                    key: Joi.string().required(),
                    signature: Joi.string().required()
                })
                .required(),

        // List of preKeys
        preKeys: Joi.array().items(preKeySchema).required().min(1),

    }
};
