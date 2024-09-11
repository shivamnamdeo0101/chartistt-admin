const { default: axios } = require("axios")

const sendPushNotification = async (payload) => {

  let data = JSON.stringify({
    "message": {
      "topic": "app",
      "notification": {
        "title": payload.title,
        "body": payload.text,
      },
      "data": {
        "url": payload.linkUrl,
        "dl": "<deeplink action on tap of notification>"
      }
    }
  });


  var config = {
    method: 'post',
    url: 'https://fcm.googleapis.com/v1/projects/thechartisttjournal-1a78e/messages:send',
    headers: {
      'Authorization': 'Bearer ya29.a0AcM612zvWMqanjzMx0pZhgJ1jsUCRGzeVdU9Cd8_DcxWNoc4IzFWBYtj8QLcaLYu22ngOm3m-rRye3DL-4rD7a3u9CEeA8HZW5uYyYOcFGm2HOdM31GI7PJn-u59VtX_TcpMtX0CSa6RVx-MeEiW7rCd3kCYQVMTGUNltZ7kaCgYKAQsSARISFQHGX2MiKv6TJyvIAO3DN9XkTlfY3A0175',
      'Content-Type': 'application/json'
    },
    data: data
  };

  await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error,"shivam");
    });
}

module.exports.sendPushNotification = sendPushNotification;