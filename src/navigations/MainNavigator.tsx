import React from 'react';
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import LoadingNavigator from './LoadingNavigator';
import { useLogin } from '../contexts/LoginProvider';

const MainNavigator = () => {
    const isLoggedIn = useLogin().isLoggedIn
    const isLoading = useLogin().isLoading
    return isLoading ? <LoadingNavigator/> : (
        isLoggedIn ? <HomeNavigator /> : <AuthNavigator />
    ) 
}

export default MainNavigator;
