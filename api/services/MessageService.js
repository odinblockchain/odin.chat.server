class MessageService {

    constructor (_database) {
        this.db = _database;
    }

    async get (deviceId, registrationId) {
        console.log(`Looking up messages: device [${deviceId}] registration [${registrationId}]`);

        const messages = [];
        const stream = this.db.createReadStream({gte: `m-${deviceId}-${registrationId}`})
            .on('data', function (data) {
                console.log(data);
                messages.push(data);
            })
            .on('close', function () {
                console.log('Stream closed');
            });

        return new Promise((resolve, reject) => {
            stream.on('end', () => resolve(messages));
            stream.on('error', () => reject(new Error('Something went terribly wrong...')));
        });
    }

    async del (deviceId, registrationId, timestamp) {
        console.log(`Deleting messages: device [${deviceId}] registration [${registrationId}] timestamp [${timestamp}]`);

        return this.db.del(`m-${deviceId}-${registrationId}-${timestamp}`);
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
