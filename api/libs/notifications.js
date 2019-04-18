const axios = require('axios');
const config = require('config');
const firebaseConfig = config.get('firebase');

module.exports = {
  push: function (userToken, title, message, options) {
    const { data, id } = options;

    console.log(`Attempting to send:
    title: ${title}
    message: ${message}
    token: ${userToken}\n`);

    axios({
      method: 'post',
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        'Authorization': `key=${firebaseConfig.key}`,
        'Content': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        "notification": {
          "title": title,
          "text": message,
          "click_action": "openODINChat",
          "badge": "1",
          "sound": "default",
          "icon": "",
          "color": "#4face0",
          "showWhenInForeground": true,
          "tag": (id) ? id : ''
        },
        "data": (data) ? data : {},
        "to": userToken,
        "collapse_key": (id) ? id : ''
      }
    })
    .then(res => {
      if (!res.data) return console.log('FCM unknown response');
      if (res.data.success === 1) {
        console.log('Delivered FCM notification');
      } else if (res.data.failure === 1) {
        console.log(`Unable to deliver FCM ...
        Errors: ${res.data.results.map(res => res.error)}\n`);
      }
    })
    .catch((error) => {
      console.log(`Failed sending notification to ${userToken}`);
      console.log(error.message ? error.message : error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('---response');
        console.log(error.response.data);
        console.log(error.response.status);
        // console.log(error.response.headers);
      }
    })
  }
};
