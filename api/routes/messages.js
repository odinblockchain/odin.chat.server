const messages = require('express').Router();

const db = require('../database');

const MessageService = require('../services/MessageService');
const messageService = new MessageService(db);

const logger = require('../logging');

const getMessages = async (req, res) => {
    logger.info(`Get messages: device [${req.query.deviceId}] registration [${req.query.registrationId}]`);

    try {
        const resp = await messageService.get(req.query.deviceId, req.query.registrationId);

        logger.info(`Found messages: ${JSON.stringify(resp)}`);

        res.json(resp);

        // remove messages
        if (resp) {
            resp.forEach((m) => messageService.del(m.key));
        }

    } catch (ex) {
        logger.error(ex);

        res.status(404).send(ex.toString());
    }
};

const putMessage = async (req, res) => {
    logger.info(`Put message: ${JSON.stringify(req.body)}`);

    try {
        await messageService.put({...req.body});

        res.status(200).send(`OK`);
    } catch (ex) {
        logger.error(ex);

        res.status(500).send(ex.toString());
    }
};

messages.get('/', getMessages);
messages.put('/', putMessage);

module.exports = messages;
