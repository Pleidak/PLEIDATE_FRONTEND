import React from "react"
import { PhoneSubmiter, VerifyPhoneNumber } from "../components/Auth"

const PhoneSubmitScreen = () => {
    return (
        <PhoneSubmiter></PhoneSubmiter>
    )
}
const CodeSubmitScreen = () => {
    return (
        <VerifyPhoneNumber></VerifyPhoneNumber>
    )
}

export {PhoneSubmitScreen, CodeSubmitScreen}