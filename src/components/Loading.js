import React from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FrameStyle } from '../public/LayoutStyles'
import * as Animatable from 'react-native-animatable';

const Loading = () => {
    return (
        <View>
            <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
                <FontAwesomeIcon style={[FrameStyle.spinner]} icon={faHeart} size={35} />
            </Animatable.View>
        </View>
    )
}

export {Loading}