import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginProvider from './src/contexts/LoginProvider';
import MainNavigator from './src/navigations/MainNavigator';
import { SocketContext, socket } from './src/contexts/Socket';


const App = () => {
    return (
      <SocketContext.Provider value={socket}>
        <LoginProvider>
          <NavigationContainer>
            <MainNavigator/>
          </NavigationContainer>
        </LoginProvider>
      </SocketContext.Provider>
    )
}

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
