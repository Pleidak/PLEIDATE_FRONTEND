import React from 'react';
import { LoadingScreen } from '../screens/ScreenIndex'
import { Stack } from '../components/NavigationStack';
import { screenOptions } from '../utils/Options';


const LoadingNavigator = () => {
    return (
        <Stack.Navigator>
              <Stack.Screen name="Loading" component={LoadingScreen} options={screenOptions}/>
        </Stack.Navigator>
    )
}

export default LoadingNavigator;
