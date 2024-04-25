import React from "react"
import { Text } from "react-native-elements"

const CustomText = (props) => {
    return (
         <Text style={{fontFamily: "Aktiv Grotesk"}} {...props} >{props.children}</Text>
    )
 }

export {CustomText}