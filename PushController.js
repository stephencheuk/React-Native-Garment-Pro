import React, { Component } from "react";
import { Platform } from 'react-native';

import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from "react-native-fcm";

export default class PushController extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    FCM.requestPermissions();

    FCM.getFCMToken().then(token => {
      console.log("TOKEN (getFCMToken)", token);
      this.props.onChangeToken(token);
    });

    FCM.getInitialNotification().then(notif => {
      console.log("INITIAL NOTIFICATION", notif)
    });

    this.notificationListner = FCM.on(FCMEvent.Notification, notif => {
      if(notif.local_notification){
        return;
      }
      if(notif.opened_from_tray){
        return;
      }

      if(Platform.OS ==='ios'){
        switch(notif._notificationType){
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData)
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All)
            break;
        }
      }
      this.showLocalNotification(notif);
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      console.log("TOKEN (refreshUnsubscribe)", token);
      this.props.onChangeToken(token);
    });
  }

  showLocalNotification(notif) {
    FCM.presentLocalNotification({
      //id: "UNIQ_ID_STRING",                               // (optional for instant notification)
      title: notif.title || "Notification",               // as FCM payload
      body: notif.body || "No Message",                   // as FCM payload (required)
      sound: "default",                                   // as FCM payload
      priority: "high",                                   // as FCM payload
      click_action: notif.click_action,                   // as FCM payload
      //badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
      //number: 10,                                         // Android only
      //ticker: "My Notification Ticker",                   // Android only
      auto_cancel: true,                                  // Android only (default true)
      //large_icon: "ic_launcher",                           // Android only
      //icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
      //big_text: "Show when notification is expanded",     // Android only
      //sub_text: "This is a subText",                      // Android only
      //color: "red",                                       // Android only
      vibrate: 300,                                       // Android only default: 300, no vibration if you pass null
      //tag: 'some_tag',                                    // Android only
      //group: "group",                                     // Android only
      //my_custom_data:'my_custom_field_value',             // extra data you want to throw
      lights: true,                                       // Android only, LED blinking (default false)
      show_in_foreground: true,                           // notification when app is in foreground (local & remote)
      local: true
    });
  }

  componentWillUnmount() {
    this.notificationListner.remove();
    this.refreshTokenListener.remove();
  }


  render() {
    return null;
  }
}