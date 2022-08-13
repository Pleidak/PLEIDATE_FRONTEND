import React from "react"
import Auth from "../components/Auth"

interface Props {
    navigation: any
}

export default class AuthScreen extends React.Component<Props> {
    render() {
        return (
            <Auth></Auth>
        )
    }
}