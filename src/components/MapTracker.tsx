import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Switch,
  Text,
  View,
} from 'react-native';

import BackgroundGeolocation, {
  Subscription
} from "react-native-background-geolocation";
import { Button } from 'react-native-elements/dist/buttons/Button';
import { DefaultColors } from "../constants/DefaultColors"
import { logout } from "../api/Auth"
import { AsyncStorage, getAsyncStorageItem, removeAsyncStorageItem } from "../utils/AsyncStorage"
import { useLogin } from '../contexts/LoginProvider';
import io from "socket.io-client";
import { SERVER_INFO } from '../constants/Server';

const SOCKET_URL = 'ws://' + SERVER_INFO.HOST + ":" + SERVER_INFO.SOCKET_PORT.toString()
const BASE_URL = 'http://' + SERVER_INFO.HOST + ':' + SERVER_INFO.PORT.toString()


const MapTracker = () => {
  const socket = io(SOCKET_URL);

  const [enabled, setEnabled] = useState(true);
  const [location, setLocation] = useState('');
  const { setIsLoggedIn } = useLogin()
  const { phoneNumber } = useLogin()

  const getDeviceInfo = async () => {
    await BackgroundGeolocation.getDeviceInfo();
  }

  const readyBGLocationService = async () => {
    const locationToken = await getAsyncStorageItem("@logintoken")
    // const tokenBG = await BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(token.toString(), "username", 'http://192.168.137.66:8000');
    await BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 0,
      reset: false,
      // Activity Recognition
      stopTimeout: 5,
      maxDaysToPersist: 14,
      // Application config
      // debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      // url: 'http://yourserver.com/locations',
      url: BASE_URL + "/api/locations",
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      preventSuspend: true,
      isMoving: true,
      enableHeadless: true,
      // schedule: [
      //   "2-8 6:00-11:00",   // Mon-Fri: 6:00am to 11:00pm
      // ],
      // headers: {              // <-- Optional HTTP headers
      //   "Authorization": `Bearer ${token}`
      // },
      // params: {               // <-- Optional HTTP params
      //   "auth_token": token
      // },
      authorization: {
        strategy: "JWT",
        accessToken: locationToken.toString(),
        refreshToken: locationToken.toString(),
        refreshPayload: {
          refresh_token: "{refreshToken}"
        },
        expires: -1
      }
    }).then((state) => {
      setEnabled(state.enabled)
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
    });
  }

  React.useEffect(() => {
    getDeviceInfo();
  }, []);
  
  useEffect(() => {
    /// 1.  Subscribe to events.
    const onLocation:Subscription = BackgroundGeolocation.onLocation((location) => {
      setLocation(JSON.stringify(location, null, 2));
      // const trackingData = {
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      //   timestamp: location.timestamp
      // }
      console.log("[location]", location)
      // socket.emit("trackingLocation", trackingData)
    })

    

    const onMotionChange:Subscription = BackgroundGeolocation.onMotionChange((event) => {
      console.log('[onMotionChange]', event);
    });

    const onActivityChange:Subscription = BackgroundGeolocation.onActivityChange((event) => {
      console.log('[onMotionChange]', event);
    })

    const onProviderChange:Subscription = BackgroundGeolocation.onProviderChange((event) => {
      console.log('[onProviderChange]', event);
    })
    
    // const token = BackgroundGeolocation.findOrCreateTransistorAuthorizationToken("Pleidate", "tracking", BASE_URL);

    /// 2. ready the plugin.
    readyBGLocationService()
    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    }
  }, []);

  /// 3. start / stop BackgroundGeolocation
  useEffect(() => {
    if (enabled) {
      console.log("start")
      BackgroundGeolocation.start();
    } else {
      console.log("stop")
      BackgroundGeolocation.stop();
      setLocation('');
    }
  }, [enabled]);

  return (
    <View style={{alignItems:'center'}}>
      {/* <Text>Click to enable BackgroundGeolocation</Text> */}
      <Button
            buttonStyle={{backgroundColor: DefaultColors.THEME}}
            titleStyle={{color: DefaultColors.WHITE}}
            title="Logout"
            onPress={async () => {
                const isLoggedOut = await logout()
                if (isLoggedOut){
                    setIsLoggedIn(false)
                    removeAsyncStorageItem("@logintoken")
                    // removeAsyncStorageItem("@locationToken")
                    // clearInterval(locationInterval)
                    
                    socket.disconnect()
                }
            }}
            />
      {/* <Switch value={enabled} onValueChange={setEnabled} /> */}
      <Text style={{fontFamily:'monospace', fontSize:12}}>{location}</Text>
    </View>
  )
}

export default MapTracker;
