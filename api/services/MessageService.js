class MessageService {

    constructor (_database) {
        this.db = _database;
    }

    async get (deviceId, registrationId) {
        console.log(`Looking up messages: device [${deviceId}] registration [${registrationId}]`);

        const messages = [];
        const stream = this.db
            .createReadStream({
                gte: `m-${deviceId}-${registrationId}`,
                lte: `m-${deviceId}-${registrationId}-999999999999999`
            })
            .on('data', function (data) {
                messages.push(data);
            });

        return new Promise((resolve, reject) => {
            stream.on('end', () => resolve(messages));
            stream.on('error', () => reject(new Error('Something went terribly wrong...')));
        });
    }

    async del (key) {
        console.log(`Deleting messages: key [${key}]`);

        return this.db.del(`${key}`);
    }

    async put (message, timestamp = new Date().getTime()) {
        const {destinationDeviceId, destinationRegistrationId} = message;
        console.log(`Put message:  device [${destinationDeviceId}] registration [${destinationRegistrationId}]`);

        const msgObj = {
            ...message,
            timestamp: timestamp
        };
        return this.db.put(`m-${destinationDeviceId}-${destinationRegistrationId}-${timestamp}`, msgObj);
    }
}

module.exports = MessageService;
