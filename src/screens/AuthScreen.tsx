import React from "react"
import { AuthBegin, PhoneSubmiter, VerifyPhoneNumber, AddUserName, AddUserAvatar } from "../components/Auth"

const AuthBeginScreen = () => {
    return (
        <AuthBegin></AuthBegin>
    )
}

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

const AddUserNameScreen = () => {
    return (
        <AddUserName></AddUserName>
    )
}

const AddUserAvatarScreen = () => {
    return (
        <AddUserAvatar></AddUserAvatar>
    )
}

export {AuthBeginScreen, PhoneSubmitScreen, CodeSubmitScreen, AddUserNameScreen, AddUserAvatarScreen}