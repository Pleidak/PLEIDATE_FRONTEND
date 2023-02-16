import React from 'react';
import { AuthNavigator, AddInfoBeginNavigator } from './AuthNavigator';
import { HomeNavigator } from './HomeNavigator';
import LoadingNavigator from './LoadingNavigator';
import { useLogin } from '../contexts/LoginProvider';
import { Stack } from '../components/NavigationStack';
import { AddUserNameScreen, AddUserAgeScreen, AddUserAvatarScreen, AddUsergenderScreen, AddUserEmailScreen, 
    AddUserInterestScreen, AddUserHeightScreen, AddUserStarSignScreen, AddUserEducationLevelScreen,
    AddUserDrinkingScreen, AddUserSmokingScreen, AddUserReligionScreen, AddUserBioScreen, AddUserInfoBeginDoneScreen
} from '../screens/AuthScreen'
import { screenOptions } from '../utils/Options';

const MainNavigator = () => {
    const isLoggedIn = useLogin().isLoggedIn
    const isLoading = useLogin().isLoading
    const isActive = useLogin().isActive
    const progress = useLogin().progress

    const addInfoStackList = [
        <Stack.Screen key={1} name="NameSubmit" component={AddUserNameScreen} options={screenOptions}/>,
        <Stack.Screen key={2} name="AgeSubmit" component={AddUserAgeScreen} options={screenOptions}/>,
        <Stack.Screen key={3} name="AvatarSubmit" component={AddUserAvatarScreen} options={screenOptions}/>,
        <Stack.Screen key={4} name="GenderSubmit" component={AddUsergenderScreen} options={screenOptions}/>,
        <Stack.Screen key={5} name="EmailSubmit" component={AddUserEmailScreen} options={screenOptions}/>,
        <Stack.Screen key={6} name="InterestSubmit" component={AddUserInterestScreen} options={screenOptions}/>,
        <Stack.Screen key={7} name="HeightSubmit" component={AddUserHeightScreen} options={screenOptions}/>,
        <Stack.Screen key={8} name="StarSignSubmit" component={AddUserStarSignScreen} options={screenOptions}/>,
        <Stack.Screen key={9} name="EducationLevelSubmit" component={AddUserEducationLevelScreen} options={screenOptions}/>,
        <Stack.Screen key={10} name="DrinkingSubmit" component={AddUserDrinkingScreen} options={screenOptions}/>,
        <Stack.Screen key={11} name="SmokingSubmit" component={AddUserSmokingScreen} options={screenOptions}/>,
        <Stack.Screen key={12} name="ReligionSubmit" component={AddUserReligionScreen} options={screenOptions}/>,
        <Stack.Screen key={13} name="BioSubmit" component={AddUserBioScreen} options={screenOptions}/>,
        <Stack.Screen key={14} name="AddUserInfoBeginDone" component={AddUserInfoBeginDoneScreen} options={screenOptions}/>
    ]
    if (progress){
        for (let i=0; i<progress-1; i++){
            addInfoStackList.shift()
        }
    }
    return isLoading ? <LoadingNavigator/> : (
        isLoggedIn ? (
            isActive ? (
                <HomeNavigator/>
            ) : (
                AddInfoBeginNavigator(addInfoStackList)
            )
        ) : <AuthNavigator />
    ) 
}

export default MainNavigator;
