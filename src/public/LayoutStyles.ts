import { StyleSheet } from "react-native";
import { DefaultColors } from "../constants/DefaultColors";

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
        color: DefaultColors.GREY
    }
})

export {FrameStyle}