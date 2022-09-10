import { StyleSheet } from "react-native";
import { Keyframe } from 'react-native-reanimated';
import { COLORS } from "../constants/Colors";

const Spin = new Keyframe({
    0: {
      transform: [{ rotate: '0deg' }],
    },
    100: {
      transform: [{ rotate: '360deg' }],
    },
})

const FrameStyle = StyleSheet.create({
    fullScreen: {
        width: '100%',
        height: '100%'
    },
    dFlex: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    spinner: {
        fontSize: 30,
        color: COLORS.grey
    }
})

export {FrameStyle, Spin}