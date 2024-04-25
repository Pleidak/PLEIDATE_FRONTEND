import React from "react"
import { View } from "react-native";
import { Loading } from "../components/Loading";
import { FrameStyle } from "../public/LayoutStyles";


const LoadingScreen = () => {
    return (
        <View style={[FrameStyle.fullScreen, FrameStyle.dFlex]}>
            <Loading></Loading>
        </View>
    )
}

export { LoadingScreen }