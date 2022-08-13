import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthScreen, HomeScreen, MatchMapScreen} from './src/screens/ScreenIndex'
import { RootStackParamList } from './src/components/RootStackPrams';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = () => {
  return {
    headerShown: false
  };
}

const App = async () => {
  const [initialRouteName, setInitialRouteName] = React.useState("Auth")

  // React.useEffect(() => {
    const getInitialRouteName = async  () => {
      try {
        const savedToken= await AsyncStorage.getItem("@logintoken")
        if (savedToken !== undefined) {
          return "Home"
        }
        else {return "Auth"}
      }
      catch (err) {
        console.log(err)
      }
    }
  // })

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={await getInitialRouteName()}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fedd1e'
          },
        }}>
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={screenOptions}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={screenOptions}
        />
        <Stack.Screen
          name="MatchMap"
          component={MatchMapScreen}
          options={screenOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fedd1e'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
