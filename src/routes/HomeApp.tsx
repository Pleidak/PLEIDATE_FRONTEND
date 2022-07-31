import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeView from '../views/HomeView';

import { COLORS } from "../constants/colors"

const Stack = createNativeStackNavigator();

const HomeApp = ({}) => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
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
        name="Home"
        component={HomeView}
      />
    </Stack.Navigator>
  )
}

export default HomeApp;