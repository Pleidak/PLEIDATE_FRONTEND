import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { CustomText } from '../utils/CustomText';
import { submitPhonehandler, submitCodeHandler } from '../api/Auth';
import { MESSAGES } from '../constants/Messages';
import authStyle from '../public/AuthStyles';
import { useLogin } from '../contexts/LoginProvider';
import { navigationStack } from './NavigationStack';
 

const PhoneSubmiter = () => {
    const [phone, setPhone] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const { setPhoneNumber } = useLogin()


    const submitPhone = async () => {
        const res = await submitPhonehandler(phone)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setPhone('')
                setIsError(false)
                setMessage(jsonRes.message)
            }   
        }
        else {
            setPhone('')
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <ImageBackground source={require('../../images/gradient-back.jpg')} style={authStyle.image}>
            <View style={authStyle.card}>
                <CustomText style={authStyle.heading}>{'Đăng nhập với số điện thoại'}</CustomText>
                <View style={authStyle.form}>
                    <View style={authStyle.inputs}>
                        <TextInput style={authStyle.input} placeholder="Số điện thoại" autoCapitalize="none" onChangeText={setPhone}></TextInput>
                        <CustomText style={[authStyle.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</CustomText>
                        <TouchableOpacity style={authStyle.button} onPress={
                            () => {
                                submitPhone()
                                setPhoneNumber(phone)
                                if (!isError){navigationStack.navigate('CodeSubmit')}
                            }
                            }>
                            <CustomText style={authStyle.buttonText}>Tiếp tục</CustomText>
                        </TouchableOpacity>
                    </View>    
                </View>
            </View>
        </ImageBackground>
    );
};

const VerifyPhoneNumber = () => {
    const { phoneNumber, setIsLoggedIn } = useLogin()
    const [code, setCode] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    console.log(phoneNumber)
    const submitCode = async () => {
        const res = await submitCodeHandler(phoneNumber, code)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                AsyncStorage.setItem("@logintoken", jsonRes.token)
                setIsError(false)
                setMessage(jsonRes.message)
            }   
        }
        else {
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }


    return (
        <ImageBackground source={require('../../images/gradient-back.jpg')} style={authStyle.image}>
            <View style={authStyle.card}>
                <Text style={authStyle.heading}>{'Mã xác thực của bạn là?'}</Text>
                <Text style={authStyle.content}>{`Nhập mã xác thực được gửi đến ${phoneNumber}`}</Text>
                <View style={authStyle.form}>
                    <View style={authStyle.inputs}>
                        <TextInput style={authStyle.input} placeholder="Mã xác thực" autoCapitalize="none" onChangeText={setCode}></TextInput>
                        <Text style={[authStyle.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        <TouchableOpacity style={authStyle.button} onPress={
                            async () => {
                                await submitCode()
                                if (!isError) {
                                    setIsLoggedIn(true)
                                }
                            }
                            }>
                            <Text style={authStyle.buttonText}>Tiếp tục</Text>
                        </TouchableOpacity>
                    </View>    
                </View>
            </View>
        </ImageBackground>
    );
}

export { PhoneSubmiter, VerifyPhoneNumber}