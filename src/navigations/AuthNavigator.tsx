import React from 'react';
import { PhoneSubmitScreen, CodeSubmitScreen} from '../screens/ScreenIndex'
import { Stack } from '../components/NavigationStack';
import { screenOptions } from '../utils/Options';

const AuthNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="PhoneSubmit" component={PhoneSubmitScreen} options={screenOptions}/>
            <Stack.Screen name="CodeSubmit" component={CodeSubmitScreen} options={screenOptions}/>
        </Stack.Navigator>
    )
}

export default AuthNavigator;
