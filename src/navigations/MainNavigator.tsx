import React from 'react';
import { AuthNavigator, AddInfoBeginNavigator } from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import LoadingNavigator from './LoadingNavigator';
import { useLogin } from '../contexts/LoginProvider';

const MainNavigator = () => {
    const isLoggedIn = useLogin().isLoggedIn
    const isLoading = useLogin().isLoading
    const isActive = useLogin().isActive
    const isJoined = useLogin().joinStatus
    console.log("111",isLoading)
    console.log("222", isJoined)
    return isLoading ? <LoadingNavigator/> : (
        isLoggedIn ? (
            isActive ? <HomeNavigator /> : <AddInfoBeginNavigator />
        ) : <AuthNavigator />
    ) 
}

export default MainNavigator;
