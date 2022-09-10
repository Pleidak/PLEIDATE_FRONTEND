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
import { SocketContext } from '../contexts/Socket';

import { COLORS } from "../constants/Colors"
import { logout } from "../api/Auth"
import { removeAsyncStorageItem } from "../utils/AsyncStorage"
import { useLogin } from '../contexts/LoginProvider';


const MapTracker = () => {
  console.log(2222)
  const [enabled, setEnabled] = useState(false);
  const [location, setLocation] = useState('');
  const { setIsLoggedIn } = useLogin()

  const socket = useContext(SocketContext);
  // const [joinStatus, setJoinStatus] = useState(false);

  let joinStatus = false

  // const handleInviteAccepted = useCallback(() => {
  //   setJoinStatus(true);
  //   console.log("Join OK")
  // }, []);
  // const trackingLocationHandler = () =>{
    let latitude = 21.030653
    let longitude = 105.847130
    const locationInterval = setInterval(()=>{
      console.log('[onLocation]', location);
      // const trackingData = {
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      //   timestamp: location.timestamp
      // }
      const trackingData = {
        latitude: latitude += 1,
        longitude: longitude += 1,
        timestamp: Date.now()
      }
      // setLocation(JSON.stringify(location, null, 2));
      if (!joinStatus){
        socket.emit("joinTracking", {room: 'tracking'});
        socket.on("joinStatus", (data: any)=>{
          if (data.status){
            joinStatus = true
            console.log(joinStatus)
            console.log("Join OK")
          }
        }); 
      }
      
      socket.emit("trackingLocation", trackingData)
    }, 1000)
  // }
  

  useEffect(() => {
    /// 1.  Subscribe to events.
    // const onLocation:Subscription = BackgroundGeolocation.onLocation((location) => {


    // })

    const onMotionChange:Subscription = BackgroundGeolocation.onMotionChange((event) => {
      console.log('[onMotionChange]', event);
    });

    const onActivityChange:Subscription = BackgroundGeolocation.onActivityChange((event) => {
      console.log('[onMotionChange]', event);
    })

    const onProviderChange:Subscription = BackgroundGeolocation.onProviderChange((event) => {
      console.log('[onProviderChange]', event);
    })

    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 0,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      // debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      // url: 'http://yourserver.com/locations',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      preventSuspend: true,
      isMoving: true,
      schedule: [
        "2-8 6:00-11:00",   // Mon-Fri: 6:00am to 11:00pm
      ],
      headers: {              // <-- Optional HTTP headers
        "X-FOO": "bar"
      },
      params: {               // <-- Optional HTTP params
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }
    }).then((state) => {
      setEnabled(state.enabled)
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
    });

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      // onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    }
  }, []);

  console.log(joinStatus)

  /// 3. start / stop BackgroundGeolocation
  useEffect(() => {
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation('');
    }
  }, [enabled]);

  return (
    <View style={{alignItems:'center'}}>
      <Text>Click to enable BackgroundGeolocation</Text>
      <Button
            buttonStyle={{backgroundColor: COLORS.theme}}
            titleStyle={{color: COLORS.white}}
            title="Logout"
            onPress={async () => {
                const isLoggedOut = await logout()
                console.log("olala")
                console.log(isLoggedOut)
                if (isLoggedOut){
                    setIsLoggedIn(false)
                    removeAsyncStorageItem("@logintoken")
                    clearInterval(locationInterval)
                    socket.disconnect()
                }
            }}
            />
      <Switch value={enabled} onValueChange={setEnabled} />
      <Text style={{fontFamily:'monospace', fontSize:12}}>{location}</Text>
    </View>
  )
}

export default MapTracker;
