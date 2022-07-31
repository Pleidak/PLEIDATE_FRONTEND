import React from "react"
import { 
    View,
    Alert,
    Platform
} from "react-native"
import {
    Button,
} from 'react-native-elements'

import AsyncStorage from "@react-native-async-storage/async-storage"

import MapTracker from "../components/MapTracker"

import { COLORS } from "../constants/colors"

interface Props {
    navigation: any
}

export default class HomeView extends React.Component<Props> {

    onClickNavigate = async (route:string) => {    
        const hasDisclosedBackgroundPermission = await AsyncStorage.getItem('@transistorsoft:hasDisclosedBackgroundPermission') == 'true';
        
        if ((Platform.OS === 'android') && !hasDisclosedBackgroundPermission) {
          // For Google Play Console Submission:  "disclosure for background permission".
          // This is just a simple one-time Alert.  This is your own responsibility to do this.
          Alert.alert('Background Location Access', [
            'BG Geo collects location data to enable tracking your trips to work and calculate distance travelled even when the app is closed or not in use.',
            'This data will be uploaded to tracker.transistorsoft.com where you may view and/or delete your location history.'
          ].join("\n\n"), [
            {text: 'Close', onPress: () => {this.onDiscloseBackgroundPermission(route)}}
          ]);
          return;   
        }
    
        this.props.navigation.navigate(route)
    };

    onDiscloseBackgroundPermission = async (route:string) => {
        await AsyncStorage.setItem('@transistorsoft:hasDisclosedBackgroundPermission', 'true');
        this.onClickNavigate(route);
    }

    render() {
        return (
            <View style={{ padding: 20, flex: 1, flexDirection: 'column', justifyContent: 'space-around' }}>
                <MapTracker></MapTracker>
                <Button
                buttonStyle={{backgroundColor: COLORS.theme}}
                titleStyle={{color: COLORS.white}}
                title="Match Map View"
                onPress={() => this.onClickNavigate('MatchMapApp') }
                />
            </View>
        )
    }
}