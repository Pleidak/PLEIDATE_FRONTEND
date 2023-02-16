import React from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FrameStyle } from '../public/LayoutStyles'
import * as Animatable from 'react-native-animatable';
import LottieView from "lottie-react-native";

const Loading = () => {
    return (
        <View>
            <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
                <LottieView
                    source={require('../public/lotties/loader.json')}
                    style={{width: 100, height: 100}}
                    autoPlay
                />
            </Animatable.View>
        </View>
    )
}

export {Loading}