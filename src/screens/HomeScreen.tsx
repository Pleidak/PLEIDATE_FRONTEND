import React, {useContext} from "react"
import { 
    View,
} from "react-native"
import {
    Button,
} from 'react-native-elements'

import MapTracker from "../components/MapTracker"
import MatchMap from "../components/MatchMap"
import { COLORS } from "../constants/Colors"
import { logout } from "../api/Auth"
import { useLogin } from "../contexts/LoginProvider"
import { navigationStack } from  "../components/NavigationStack"
import { removeAsyncStorageItem } from "../utils/AsyncStorage"
// import { SocketProvider } from "../contexts/SocketProvider"


const MeetingScreen = () => {
    return (
        <View style={{ padding: 20, flex: 1, flexDirection: 'column', justifyContent: 'space-around' }}>
            <MapTracker></MapTracker>
            <Button
            buttonStyle={{backgroundColor: COLORS.theme}}
            titleStyle={{color: COLORS.white}}
            title="Match Map View"
            onPress={() => {navigationStack.navigate('MatchMap')} }
            />
        </View>
    )
}

const MatchMapScreen = () => {
    return (
        <MatchMap></MatchMap>
    )
}

export { MeetingScreen, MatchMapScreen }