import React from 'react';
import {
  Switch,
  Text,
  View,
} from 'react-native';

import BackgroundGeolocation, {
  Location,
  Subscription
} from "react-native-background-geolocation";

export default class MapTracker extends React.Component {
  subscriptions:Subscription[] = [];
  state:any = {};
  constructor(props:any) {
    super(props);
    this.state = {
      enabled: true,
      location: ''
    }
  }

  componentDidMount() {
    /// 1.  Subscribe to BackgroundGeolocation events.
    this.subscriptions.push(BackgroundGeolocation.onLocation((location) => {
      console.log('[onLocation]', location);
      this.setState({location: JSON.stringify(location, null, 2)})
    }, (error) => {
      console.log('[onLocation] ERROR:', error);
    }))

    this.subscriptions.push(BackgroundGeolocation.onMotionChange((event) => {
      console.log('[onMotionChange]', event);
    }))

    this.subscriptions.push(BackgroundGeolocation.onActivityChange((event) => {
      console.log('[onActivityChange]', event);
    }))

    this.subscriptions.push(BackgroundGeolocation.onProviderChange((event) => {
      console.log('[onProviderChange]', event);
    }))

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
      this.setState({enabled: state.enabled});
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
    }).catch((error) => {
      throw error;
    })
  }

  /// When view is destroyed (or refreshed during development live-reload),
  /// remove BackgroundGeolocation event subscriptions.
  componentWillUnmount() {
    this.subscriptions.forEach((subscription) => subscription.remove());
    BackgroundGeolocation.start();
  }


  // onToggleEnabled(value:boolean) {
  //   console.log('[onToggleEnabled]', value);
  //   this.setState({enabled: value})
  //   if (value) {
  //     BackgroundGeolocation.start();
  //   } else {
  //     this.setState({location: ''});
  //     BackgroundGeolocation.stop();
  //   }
  // }

  render() {
    return (
      <View style={{alignItems:'center'}}>
        <Text>Click to enable BackgroundGeolocation</Text>
        {/* <Switch value={this.state.enabled} onValueChange={this.onToggleEnabled.bind(this)} /> */}
        <Text style={{fontFamily:'monospace', fontSize:12}}>{this.state.location}</Text>
      </View>
    )
  }
}