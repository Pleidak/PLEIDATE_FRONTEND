import React from 'react';
import { MeetingScreen, MatchMapScreen } from "../screens/HomeScreen"
import { Stack } from '../components/NavigationStack';
import { screenOptions } from '../utils/Options';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHouseCrack, faFire, faDumpsterFire, faMask, faHeartCircleCheck, faGift, faCommentDots, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { DefaultColors } from '../constants/DefaultColors';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from '@react-navigation/native';
import mettings from '../components/Meetings';
import { useLogin } from '../contexts/LoginProvider';
import { LoadingScreen } from '../screens/LoadingScreen';
import { GiftScreen } from '../screens/GiftScreen';

const BottomTab = createBottomTabNavigator();

const HomeNavigator = () => {

    const {userInfo} = useLogin()
    return (
        <BottomTab.Navigator  screenOptions={{
            title: 'pleidate',
            headerTitleAlign: 'center',
            tabBarStyle: { borderTopWidth: 0, elevation: 0 },
            headerLeft: ()=>(
                <TouchableOpacity style={[styles.avtBut]} onPress={
                    async () => {
                    }
                    }>
                    {
                        userInfo.mainAvatar ?
                        <Image source={{uri: userInfo.mainAvatar}} style={{width: 40, height: 40, borderRadius: 50, borderWidth: 1, borderColor: DefaultColors.GREY}}></Image>:
                        <FontAwesomeIcon icon={faCircleUser} color={DefaultColors.GREY} size={32} />
                    }
                </TouchableOpacity>
            )
          }}>
            {/* <Stack.Screen name="Loading" component={LoadingScreen} options={screenOptions}/> */}
            <BottomTab.Group>
            <BottomTab.Screen name="GiftCatching" component={GiftScreen}  options={{
                    headerTintColor: DefaultColors.THEME,
                    tabBarLabel: 'Săn quà',
                    tabBarActiveTintColor: DefaultColors.THEME,
                    tabBarIcon: ({focused}) => (
                        <FontAwesomeIcon icon={faFire} color={focused ? DefaultColors.THEME: DefaultColors.GREY} size={29} />
                    ),
                    tabBarBadge: undefined,
                }}/>
                <BottomTab.Screen name="Meeting" component={MeetingScreen}  options={{
                    headerTintColor: DefaultColors.THEME,
                    tabBarLabel: 'Gặp gỡ',
                    tabBarActiveTintColor: DefaultColors.THEME,
                    tabBarIcon: ({focused}) => (
                        <FontAwesomeIcon icon={faHouseCrack} color={focused ? DefaultColors.THEME: DefaultColors.GREY} size={29} />
                    ),
                    tabBarBadge: undefined,
                }}/>
              
                <BottomTab.Screen name="Matching" component={GiftScreen}  options={{
                    headerTintColor: DefaultColors.THEME,
                    tabBarLabel: 'Ghép đôi',
                    tabBarActiveTintColor: DefaultColors.THEME,
                    tabBarIcon: ({focused}) => (
                        <FontAwesomeIcon icon={faHeartCircleCheck} color={focused ? DefaultColors.THEME: DefaultColors.GREY} size={29} />
                    ),
                    tabBarBadge: undefined,
                }}/>
                <BottomTab.Screen name="MatchMap" component={GiftScreen} options={{
                    headerTintColor: DefaultColors.THEME,
                    tabBarLabel: 'Tin nhắn',
                    tabBarActiveTintColor: DefaultColors.THEME,
                    tabBarIcon: ({focused}) => (
                        <FontAwesomeIcon icon={faCommentDots} color={focused ? DefaultColors.THEME: DefaultColors.GREY} size={29} />
                    ),
                    tabBarBadge: undefined,
                }}/>
            </BottomTab.Group>
        </BottomTab.Navigator>
    )
}

const styles = StyleSheet.create({
    avtBut: {
        marginLeft: '12%'
    }
})

export {HomeNavigator};
