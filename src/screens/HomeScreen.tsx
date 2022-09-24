import React, {useContext} from "react"
import { 
    View,
} from "react-native"
import {
    Button,
} from 'react-native-elements'

import MapTracker from "../components/MapTracker"
import MatchMap from "../components/MatchMap"
import { Colors } from "../constants/Colors"
import { navigationStack } from  "../components/NavigationStack"
// import { SocketProvider } from "../contexts/SocketProvider"


const MeetingScreen = () => {
    console.log(333)
    return (
        <View style={{ padding: 20, flex: 1, flexDirection: 'column', justifyContent: 'space-around' }}>
            <MapTracker></MapTracker>
            <Button
                buttonStyle={{backgroundColor: Colors.THEME}}
                titleStyle={{color: Colors.WHITE}}
                title="Match Map View"
                onPress={() => {
                    console.log(222)
                    navigationStack.navigate('MatchMap')
                } }
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