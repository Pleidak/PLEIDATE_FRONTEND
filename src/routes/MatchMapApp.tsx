import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchMapView from '../components/MatchMap';

import { COLORS } from "../constants/colors"

const Stack = createNativeStackNavigator();

const HomeApp = ({}) => {
  return (
    <Stack.Navigator
      initialRouteName="MatchMap"
      screenOptions={{
        title: 'PLEIDATE',
        headerStyle: {
          backgroundColor: COLORS.white
        },
        headerTitleStyle: {
          color: COLORS.theme
        },
        headerTitleAlign: 'center'
      }}>
      <Stack.Screen
        name="Match Map"
        component={MatchMapView}
      />
    </Stack.Navigator>
  )
}

export default HomeApp;