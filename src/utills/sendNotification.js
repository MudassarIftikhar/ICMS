import axios from 'axios';
import {ToastAndroid} from 'react-native';
const sendNotification = async (_token, msgBody, msgTitle) => {
  console.log(msgBody, msgTitle, _token);
  const fcmToken = _token;

  const data = {
    data: {sound: 'default'},
    notification: {
      body: msgBody,
      title: msgTitle,
      // icon: 'ic_launcher',
    },
    to: fcmToken,
  };

  const config = {
    headers: {
      Authorization:
        'key=AAAABIYYfh0:APA91bF_AJSvu-U51mxnhRdaXq6-YSFqilNv6VetBavVZ0N_tLwr6h7bmGRp9mSwOJkaTQiS9KMvfgtMfo_G2_gwtmwALdNr-xFyBeZ_VzXMFYqgGjkNQ71NI7UgcKYJFacFAYwnD7aQ',
      'Content-Type': 'application/json',
    },
  };

  try {
    if (fcmToken) {
      const response = await axios.post(
        'https://fcm.googleapis.com/fcm/send',
        data,
        config,
      );
      console.log('Notification sent successfully:', response.data);
    } else {
      ToastAndroid.show('DeviceToken is null!', ToastAndroid.SHORT);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export default sendNotification;
