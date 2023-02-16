import React from 'react';
import { AuthBeginScreen, PhoneSubmitScreen, CodeSubmitScreen, AddUserNameScreen, AddUserAgeScreen, AddUserAvatarScreen,
    AddUsergenderScreen, AddUserEmailScreen, AddUserInterestScreen, AddUserHeightScreen, AddUserStarSignScreen,
    AddUserEducationLevelScreen, AddUserDrinkingScreen, AddUserSmokingScreen, AddUserReligionScreen, AddUserBioScreen, AddUserInfoBeginDoneScreen
} from "../screens/AuthScreen"
import { Stack } from '../components/NavigationStack';
import { screenOptions } from '../utils/Options';
import { useLogin } from '../contexts/LoginProvider';

const AuthNavigator = () => {
    const isActive = useLogin()
    return (
        <Stack.Navigator>
            <Stack.Screen name="AuthBegin" component={AuthBeginScreen} options={screenOptions}/>
            <Stack.Screen name="PhoneSubmit" component={PhoneSubmitScreen} options={screenOptions}/>
            <Stack.Screen name="CodeSubmit" component={CodeSubmitScreen} options={screenOptions}/>
            <Stack.Screen name="NameSubmit" component={AddUserNameScreen} options={screenOptions}/>
            <Stack.Screen name="AgeSubmit" component={AddUserAgeScreen} options={screenOptions}/>
            <Stack.Screen name="AvatarSubmit" component={AddUserAvatarScreen} options={screenOptions}/>
            <Stack.Screen name="GenderSubmit" component={AddUsergenderScreen} options={screenOptions}/>
            <Stack.Screen name="EmailSubmit" component={AddUserEmailScreen} options={screenOptions}/>
            <Stack.Screen name="InterestSubmit" component={AddUserInterestScreen} options={screenOptions}/>
            <Stack.Screen name="HeightSubmit" component={AddUserHeightScreen} options={screenOptions}/>
            <Stack.Screen name="StarSignSubmit" component={AddUserStarSignScreen} options={screenOptions}/>
            <Stack.Screen name="EducationLevelSubmit" component={AddUserEducationLevelScreen} options={screenOptions}/>
            <Stack.Screen name="DrinkingSubmit" component={AddUserDrinkingScreen} options={screenOptions}/>
            <Stack.Screen name="SmokingSubmit" component={AddUserSmokingScreen} options={screenOptions}/>
            <Stack.Screen name="ReligionSubmit" component={AddUserReligionScreen} options={screenOptions}/>
            <Stack.Screen name="BioSubmit" component={AddUserBioScreen} options={screenOptions}/>
            <Stack.Screen name="AddUserInfoBeginDone" component={AddUserInfoBeginDoneScreen} options={screenOptions}/>
        </Stack.Navigator>
    )
}

const AddInfoBeginNavigator = (children: any) => {
    return (
        <Stack.Navigator>
            {children}
        </Stack.Navigator>
    )
}

export { AuthNavigator, AddInfoBeginNavigator };
