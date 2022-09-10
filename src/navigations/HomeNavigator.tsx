import React from 'react';
import { MeetingScreen, MatchMapScreen} from '../screens/ScreenIndex'
import { Stack } from '../components/NavigationStack';
import { screenOptions } from '../utils/Options';


const HomeNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Group>
              <Stack.Screen name="Meeting" component={MeetingScreen} options={screenOptions}/>
              <Stack.Screen name="MatchMap" component={MatchMapScreen} options={screenOptions}/>
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default HomeNavigator;
