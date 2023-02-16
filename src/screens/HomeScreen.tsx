import React, {useContext} from "react"
import { 
    View,
} from "react-native"
import {
    Button,
} from 'react-native-elements'

import { DefaultColors } from "../constants/DefaultColors"
import MapTracker from "../components/MapTracker"
import MatchMap from "../components/MatchMap"
import { navigationStack } from  "../components/NavigationStack"
import Mettings from "../components/Meetings"
// import { SocketProvider } from "../contexts/SocketProvider"


const MeetingScreen = () => {
    return (
        <Mettings></Mettings>
    )
}

const MatchMapScreen = () => {
    return (
        <MatchMap></MatchMap>
    )
}

export { MeetingScreen, MatchMapScreen }