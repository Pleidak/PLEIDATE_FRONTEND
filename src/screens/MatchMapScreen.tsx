import React from "react"
import { 
    View,
    Alert,
    Platform
} from "react-native"
import {
    Button,
} from 'react-native-elements'

import MatchMap from "../components/MatchMap"

import { COLORS } from "../constants/Colors"

interface Props {
    navigation: any
}

export default class MatchMapScreen extends React.Component<Props> {

    render() {
        return (
            <MatchMap></MatchMap>
        )
    }
}