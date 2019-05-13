const Joi = require('joi');

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
    fcmToken: Joi.string().allow('').optional()
  }
};
