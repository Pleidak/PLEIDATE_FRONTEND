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

const MainStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = () => {
  return {
    headerShown: false
  };
}

const App = () => {
  const [isLogin, setIsLogin] = React.useState(false)

  React.useEffect(() => {
    async () => {
      try {
        const savedToken= await AsyncStorage.getItem("@logintoken")
        if (savedToken !== undefined) {setIsLogin(true)}
      }
      catch (err) {console.log(err)}
    }
    console.log(isLogin)
  })

  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name= {isLogin ? "Home" : "Auth"}
            component={AuthScreen}
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
