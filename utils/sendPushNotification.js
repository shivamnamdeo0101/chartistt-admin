const { default: axios } = require("axios")

const sendPushNotification = async (payload) => {
  var data = JSON.stringify({
    "to": "/topics/app",
    "notification": {
      "title": payload.title,
      "body": payload.text,
      "mutable_content": true,
      "sound": "Tri-tone"
    },
    "data": {
      "url": payload.linkUrl,
      "dl": "<deeplink action on tap of notification>"
    }
  });
  
  var config = {
    method: 'post',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: { 
      'Authorization': 'key=AAAAF_X2BUg:APA91bFsm6G6D2dY_2jOtQLTPjdUBJNSFN_LjFvb65LQyoO6ieIKH_f-FaweQIMXJTkgp_g8vjR7PedOt2_ajQLYJQ7tNKJrrdjwy2yJmtaiFG-ZeeI10B4p6uoWarZ3rhfzRv3UQAlN', 
      'Content-Type': 'application/json', 
      'project_id': 'thechartisttjournal-1a78e'
    },
    data : data
  };
  
  await axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
  }

  module.exports.sendPushNotification = sendPushNotification;