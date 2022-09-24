import React from 'react';
import { AuthBeginScreen, PhoneSubmitScreen, CodeSubmitScreen, AddUserNameScreen, AddUserAvatarScreen } from '../screens/ScreenIndex'
import { Stack } from '../components/NavigationStack';
import { screenOptions } from '../utils/Options';
import { useLogin } from '../contexts/LoginProvider';

const AuthNavigator = () => {
    const isActive = useLogin()
    console.log(isActive)
    return (
        <Stack.Navigator>
            <Stack.Screen name="AuthBegin" component={AuthBeginScreen} options={screenOptions}/>
            <Stack.Screen name="PhoneSubmit" component={PhoneSubmitScreen} options={screenOptions}/>
            <Stack.Screen name="CodeSubmit" component={CodeSubmitScreen} options={screenOptions}/>
            <Stack.Screen name="NameSubmit" component={AddUserNameScreen} options={screenOptions}/>
            <Stack.Screen name="AvatarSubmit" component={AddUserAvatarScreen} options={screenOptions}/>
        </Stack.Navigator>
    )
}

const AddInfoBeginNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="NameSubmit" component={AddUserNameScreen} options={screenOptions}/>
            <Stack.Screen name="AvatarSubmit" component={AddUserAvatarScreen} options={screenOptions}/>
        </Stack.Navigator>
    )
}

export { AuthNavigator, AddInfoBeginNavigator };
