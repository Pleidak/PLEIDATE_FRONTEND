import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginProvider from './src/contexts/LoginProvider';
import MainNavigator from './src/navigations/MainNavigator';


const App = () => {
  return (
    <LoginProvider>
        <NavigationContainer>
          <MainNavigator/>
        </NavigationContainer>
    </LoginProvider>
  )
}

export default App;
