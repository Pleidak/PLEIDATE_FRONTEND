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

import { COLORS } from "../constants/colors"

interface Props {
    navigation: any
}

export default class HomeView extends React.Component<Props> {

    render() {
        return (
            <MatchMap></MatchMap>
        )
    }
}