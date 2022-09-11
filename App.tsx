import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginProvider from './src/contexts/LoginProvider';
import MainNavigator from './src/navigations/MainNavigator';
// import { SocketProvider } from './src/contexts/SocketProvider';


const App = () => {
    return (
      <LoginProvider>
        {/* <SocketProvider> */}
          <NavigationContainer>
            <MainNavigator/>
          </NavigationContainer>
        {/* </SocketProvider> */}
      </LoginProvider>
    )
}

export default App;
