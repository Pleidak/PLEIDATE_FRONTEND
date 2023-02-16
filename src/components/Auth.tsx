import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, SectionList, Pressable, Button,} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { submitPhonehandler, submitCodeHandler, submitUserInfoHandler, submitUserExtraHandler, submitMediaHandler, submitUserHandler, submitUserInterestHandler } from '../api/Auth';
import { MESSAGES } from '../constants/Messages';
import { useLogin } from '../contexts/LoginProvider';
import { navigationStack } from './NavigationStack';
import { DefaultColors } from '../constants/DefaultColors';
import { defaultText } from '../constants/DefaultTexts';
import CheckBox from '@react-native-community/checkbox';
import { CountryCode, Country, countryPhoneCode } from '../utils/countryCodeType'
import ImagePicker from 'react-native-image-crop-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowTrendUp, faXmark } from '@fortawesome/free-solid-svg-icons'
import LottieView from "lottie-react-native";
import levenshtein from 'js-levenshtein';
import { removeAsyncStorageItem } from '../utils/AsyncStorage';
import DatePicker from 'react-native-date-picker'


const AuthBegin = () => {
    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={[styles.half, styles.dFlex]}>
                    <Text style={styles.heading}>{'Pleidate'}</Text>
                </View>
                <View style={styles.half}>
                    <View style={styles.authMethod}>
                        <View style={[styles.buttons]}>
                            <TouchableOpacity style={[styles.button, styles.blueBtn]} onPress={
                                () => {navigationStack.navigate('FacebookSubmit')}}>
                                <Text style={[styles.buttonText]}>{defaultText.FACEBOOK_LOGIN_BTN}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={
                                () => {navigationStack.navigate('PhoneSubmit')}}>
                                <Text style={styles.buttonText}>{defaultText.PHONE_LOGIN_BTN}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.PRIVACY_REMINDER}</Text>
                </View>
            </View>
        </View>
    );
}

const PhoneSubmiter = () => {
    // const [selectedCallingCode, setSelectedCallingCode] = useState('');
    // const [countryCode, setCountryCode] = useState('+84');
    const [countryCode, setCountryCode] = useState<CountryCode>('VN')
    const [country, setCountry] = useState<Country>()
    const [phoneCode, setPhoneCode] = useState('+84')
    const [withFlag, setWithFlag] = useState<boolean>(true)
    const [withCallingCodeButton, setWithCallingCodeButton] = useState<boolean>(true)
    const [phone, setPhone] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const { setPhoneNumber } = useLogin()
    const [waiting, setWaiting] = useState(false)


    const onSelect = (country: Country) => {
        setCountryCode(country.cca2)
        setCountry(country)
        for (let i=0; i<countryPhoneCode.length; i++){
            if (countryPhoneCode[i].code == country.cca2){setPhoneCode(countryPhoneCode[i].dial_code)}
        }
    }

    const submitPhone = async () => {
        const absolutePhone = phoneCode+phone
        const res = await submitPhonehandler(absolutePhone)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                return absolutePhone
            }   
        }else{
            setPhone('')
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexRowStart}>
                    <Text style={styles.heading}>{defaultText.PHONE_SUBMIT_TITLE}</Text>
                    <Text style={styles.text}>{defaultText.PHONE_SUBMIT_CONTENT}</Text>
                </View>
                <View style={[styles.form, styles.dFlex, styles.half]}>
                    <View style={[styles.inputs, styles.dFlex]}>
                        <View style={[styles.input, styles.phoneCode, styles.dFlex]}>
                            <CountryPicker
                                {...{
                                countryCode,
                                withFlag,
                                withCallingCodeButton,
                                onSelect,
                                }}
                            />
                        </View>
                        <TextInput style={[styles.input, styles.phoneNumber]} placeholder="Số điện thoại" keyboardType='number-pad' autoCapitalize="none" onChangeText={setPhone}></TextInput>
                    </View>
                </View>
                <View style={[styles.half, styles.dFlex]}>
                    <View style={[styles.authMethod, styles.dFlex]}>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, phone ? undefined:styles.BtnDisabled]} disabled={phone ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                const absolutePhone = await submitPhone()
                                setPhoneNumber(absolutePhone)
                                if (!isError){navigationStack.navigate('CodeSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_NOT_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
};

const VerifyPhoneNumber = () => {
    const CELL_COUNT = 6;
    const { phoneNumber, setIsLoggedIn, setIsActive, setUserInfo } = useLogin()
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [value, setValue] = useState('');
    const [disabled, setDisabled] = useState(true)
    const [countRemaining, setCountRemaining] = useState(60)
    const [waiting, setWaiting] = useState(false)

    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });

    const resendCodeTimeout = () => {
        const timeout = setTimeout(() => {
            if (countRemaining >= 0) {
                setCountRemaining((countRemaining) => countRemaining - 1)
            }
            if (countRemaining === 0) {
                setDisabled(false)
                // setCountRemaining(-1)
            }
        }, 1000)
        return () => {
            clearTimeout(timeout)
        };
    }

    useEffect(() => {
        resendCodeTimeout()
    }, [countRemaining])

    useEffect(() => {
        return () => {
            setCountRemaining(0)
        }
    }, []);

    const submitPhone = async () => {
        const res = await submitPhonehandler(phoneNumber)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
            }   
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    const submitCode = async () => {
        const res = await submitCodeHandler(phoneNumber, value)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                AsyncStorage.setItem("@logintoken", jsonRes.token)
                setIsError(false)
                setUserInfo({
                    userId: jsonRes.userId,
                    mainAvatar: jsonRes.mainAvatar
                })
                AsyncStorage.setItem("@userInfo", JSON.stringify({
                    userId: jsonRes.userId,
                    mainAvatar: jsonRes.mainAvatar
                }))
                setMessage(jsonRes.message)
                if (jsonRes.isActive){
                    // AsyncStorage.setItem("@locationToken", jsonRes.locationToken)
                    AsyncStorage.setItem("@isActive", jsonRes.isActive.toString())
                    setIsActive(true)
                }
                else {
                    AsyncStorage.setItem("@progress", '1')
                }
            }   
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={[styles.dFlexColStart]}>
                    <Text style={styles.heading}>{defaultText.CODE_SUBMIT_TITLE}</Text>
                    <Text style={styles.text}>{defaultText.CODE_SUBMIT_CONTENT}</Text>
                    <Text style={styles.textBold}>{phoneNumber}</Text>
                </View>
                <View style={[styles.form, styles.dFlex, styles.half]}>
                    <CodeField
                        ref={ref}
                        {...props}
                        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        autoFocus={true}
                        renderCell={({index, symbol, isFocused}) => (
                        <Text
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell]}
                            onLayout={getCellOnLayoutHandler(index)}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                        )}
                    />
                    <View style={[styles.dFlexRowStart, styles.flexRow]}>
                        <Text style={styles.text}>Không nhận được mã? </Text>
                        <TouchableOpacity style={styles.tranparentBtn} disabled={disabled} onPress={
                             async () => {
                                await submitPhone()
                                setDisabled(true)
                                setCountRemaining(60)
                                // resendCodeTimeout()
                            }
                        }>
                            <Text style={disabled ? styles.disableTextLink : styles.textLink}>Gửi lại</Text>
                        </TouchableOpacity>
                        <Text style={styles.text}> ({countRemaining})</Text>
                    </View>
                    <View style={[styles.dFlexRowStart, styles.flexRow]}>
                        <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                    </View>
                </View>

                <View style={[styles.half, styles.dFlex]}>
                    <View style={[styles.authMethod, styles.dFlex]}>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, value ? undefined:styles.BtnDisabled]} disabled={value ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                setCountRemaining(0)
                                await submitCode()
                                if (!isError) {
                                    setCountRemaining(0)
                                    setIsLoggedIn(true)
                                    // navigationStack.navigate('NameSubmit')
                                }
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_NOT_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
}

const AddUserName = () => {
    const [userName, setUserName] = useState('')
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)


    const submitName = async () => {
        const res = await submitUserInfoHandler('name', userName)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                AsyncStorage.setItem("@progress", '2')
            } 
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.NAME_SUBMIT_TITLE}</Text>
                    <Text style={styles.text}>{defaultText.NAME_SUBMIT_CONTENT}</Text>
                </View>
                <View style={[styles.form, styles.dFlexRowStart, styles.half]}>
                    <View style={[styles.inputs, styles.dFlex]}>
                        <TextInput style={[styles.input]} placeholder="Tên của bạn" autoCapitalize="none" onChangeText={setUserName}></TextInput>
                    </View>
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    {
                        isError ? (
                            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        ): (
                            undefined
                        )
                    }
                </View>
                <View style={[styles.half, styles.dFlex]}>
                    <View style={[styles.authMethod, styles.dFlex]}>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, userName ? undefined:styles.BtnDisabled]} disabled={userName ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                await submitName()
                                if (!isError){navigationStack.navigate('AgeSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
}

const AddUserAge= () => {
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)
    const [date, setDate] = useState(new Date())

    const submitAge= async () => {
        const res = await submitUserInfoHandler('age', date)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                AsyncStorage.setItem("@progress", '3')
            } 
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.AGE_SUBMIT_TITLE}</Text>
                    <Text style={styles.text}>{defaultText.AGE_SUBMIT_CONTENT}</Text>
                </View>
                <View style={[styles.form, styles.dFlexRowStart, styles.half]}>
                    <View style={[styles.inputs, styles.dFlex]}>
                        <View style={[styles.half, styles.dFlex, styles.mgTopLg]}>
                            <DatePicker date={date} mode='date' onDateChange={setDate} />
                        </View>
                    </View>
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    {
                        isError ? (
                            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        ): (
                            undefined
                        )
                    }
                </View>
                <View style={[styles.half, styles.dFlex]}>
                    <View style={[styles.authMethod, styles.dFlex]}>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, date ? undefined:styles.BtnDisabled]} disabled={date ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                await submitAge()
                                if (!isError){navigationStack.navigate('AvatarSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
}

const AddUserAvatar = () => {
    const avatarInitState = [{'path': null}, {'path': null}, {'path': null}]
    const [userAvatar, setUserAvatar] = useState(avatarInitState)
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)
    const {setUserInfo} = useLogin()

    const addAvatar = (data: any, order: number, userAvatar: any) => {
        let newAvatarObj = userAvatar
        let newAvatarObjLength = 0
        let avtOrder = order
        if (data && data.length <= 3){
            for (let i=0; i<newAvatarObj.length; i++){
                if (newAvatarObj[i].path){newAvatarObjLength ++}
            }
            for (let i=0; i<newAvatarObj.length; i++){
                if (!newAvatarObj[i].path && data[0]){
                    // if (newAvatarObj[i].order == order){order = order + 1}
                    if (newAvatarObjLength <= avtOrder){data[0].order = newAvatarObjLength + 1}
                    else {data[0].order = avtOrder}
                    newAvatarObj.splice(i, 1, data[0])
                    data.shift()
                    if (data.length > 0){
                        newAvatarObjLength ++
                        avtOrder ++
                    }
                }
            }
            const results = newAvatarObj.filter((element: any) => {
                if (Object.keys(element).length !== 0) {
                  return true;
                }
              
                return false;
            })
            setUserAvatar(results)
        }
    }

    const removeAvatar = (key: number, userAvatar: any) => {
        let newAvatarObj = userAvatar
        for (let i=key; i<newAvatarObj.length-1; i++){
            newAvatarObj.splice(i, 1, newAvatarObj[i+1])
            newAvatarObj.splice(i+1, 1, {'path': null})
            newAvatarObj[i].order = newAvatarObj[i].order - 1
        }
        
        const results = newAvatarObj.filter((element: any) => {
            if (Object.keys(element).length !== 0) {
              return true;
            }
          
            return false;
        })
        setUserAvatar(results)
        // setUserAvatar(userAvatar.filter(item => userAvatar.indexOf(item) != key))
        // const newAva = userAvatar.splice(key, 1, {'path': null})
        // setUserAvatar((userAvatar) => userAvatar.splice(key, 1, {'path': null}))
    }

    const openImageLibrary = async (order: number) => {
        // const result = await launchImageLibrary({mediaType:'photo', selectionLimit: 3});
        ImagePicker.openPicker({
            multiple: true,
            cropping: true,
            mediaType: 'photo'
        }).then(images => {
            // for (let i=0; i< images.length; i++){
            //     ImagePicker.openCropper({
            //         path: images[i].path,
            //         width: 300,
            //         height: 500,
            //         mediaType: 'photo'
            //     }).then(image => {
            //       });
            // }
            addAvatar(images, order, userAvatar)
        });
        // setUserAvatar(userAvatar => ({
        //     ...userAvatar,
        //     ...result.assets
        //   }))
        // const data = result?.assets
        // addAvatar(data, order,  userAvatar)
    }

    const submitAvatar = async () => {
        const res = await submitMediaHandler('avatar', userAvatar)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setUserInfo({
                    userId: jsonRes.userId,
                    mainAvatar: jsonRes.mainAvatar
                })
                AsyncStorage.setItem("@userInfo", JSON.stringify({
                    userId: jsonRes.userId,
                    mainAvatar: jsonRes.mainAvatar
                }))
                setMessage(jsonRes.message)
                AsyncStorage.setItem("@progress", '4')
            }   
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.AVATAR_SUBMIT_TITLE}</Text>
                    <Text style={styles.text}>{defaultText.AVATAR_SUBMIT_CONTENT}</Text>
                </View>
                <View style={[styles.form, styles.dFlex, styles.half]}>
                    <View style={[styles.addAvatarFrame]}>
                        <TouchableOpacity
                            style={[styles.addAvatarBtnMain, styles.dFlex]}
                            onPress={()=>{openImageLibrary(1)}}>
                            {
                                userAvatar[0].path ? 
                                (
                                    <View style={styles.avatarThumbFrame}>
                                        <Image source={{uri: userAvatar[0].path}} style={styles.avatarThumb} />
                                        <TouchableOpacity style={styles.removeAvatarIconFrame} onPress={() => {removeAvatar(0, userAvatar)}}>
                                            <FontAwesomeIcon style={styles.removeAvatarIcon} icon={faXmark} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                ):(
                                    <Text style={styles.addAvaterIcon}>+</Text>
                                )
                            }
                        </TouchableOpacity>
                        <View style={[styles.addAvatarExtra]}>
                            <TouchableOpacity
                                style={[styles.addAvatarBtn1, styles.dFlex]}
                                onPress={()=>{openImageLibrary(2)}}>
                                {
                                    userAvatar[1].path ? 
                                    (
                                        <View style={styles.avatarThumbFrame}>
                                            <Image source={{uri: userAvatar[1].path}} style={styles.avatarThumb} />
                                            <TouchableOpacity style={styles.removeAvatarIconFrame} onPress={() => {removeAvatar(1, userAvatar)}}>
                                                <FontAwesomeIcon style={styles.removeAvatarIcon} icon={faXmark} size={14} />
                                            </TouchableOpacity>
                                        </View>
                                    ):(
                                        <Text style={styles.addAvaterIcon}>+</Text>
                                    )
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.addAvatarBtn2, styles.dFlex]}
                                onPress={()=>{openImageLibrary(3)}}>
                                {
                                    userAvatar[2].path ? 
                                    (
                                        <View style={styles.avatarThumbFrame}>
                                            <Image source={{uri: userAvatar[2].path}} style={styles.avatarThumb} />
                                            <TouchableOpacity style={styles.removeAvatarIconFrame} onPress={() => {removeAvatar(2, userAvatar)}}>
                                                <FontAwesomeIcon style={styles.removeAvatarIcon} icon={faXmark} size={14} />
                                            </TouchableOpacity>
                                        </View>
                                    ):(
                                        <Text style={styles.addAvaterIcon}>+</Text>
                                    )
                                }
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </View>
                {isError ? (
                    <View style={[styles.dFlexRowStart, styles.flexRow]}>
                        <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                    </View>
                ): (undefined)}

                <View style={[styles.half, styles.dFlex]}>
                    <View style={[styles.authMethod, styles.dFlex]}>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, userAvatar ? undefined:styles.BtnDisabled]} disabled={userAvatar ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                await submitAvatar()
                                if (!isError){navigationStack.navigate('GenderSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
}

const AddUserGender = () => {
    const [gender, setGender] = useState(0)
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)

    const submitGender = async () => {
        const res = await submitUserExtraHandler('gender', gender)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                AsyncStorage.setItem("@progress", '5')
            }   
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.LOOKING_FOR_SUBMIT_TITLE}</Text>
                    <Text style={styles.text}>{defaultText.CAN_CHANGE_ANSWER_ANYTIME}</Text>
                </View>
                <View style={[styles.form, styles.dFlexRowStart, styles.half]}>
                    <View style={[styles.checkboxFrame]}>
                        <Text style={styles.textChoice}>Nam</Text>
                        <CheckBox
                            value={gender==0?true:false}
                            onValueChange={()=>{
                                setGender(0)
                            }}
                        />
                    </View>
                    <View style={[styles.checkboxFrame]}>
                        <Text style={styles.textChoice}>Nữ</Text>
                        <CheckBox
                            value={gender==1?true:false}
                            onValueChange={()=>{
                                setGender(2)
                            }}
                        />
                    </View>
                    <View style={[styles.checkboxFrame]}>
                        <Text style={styles.textChoice}>Phi nhị nguyên giới</Text>
                        <CheckBox
                            value={gender==2?true:false}
                            onValueChange={()=>{
                                setGender(2)
                            }}
                        />
                    </View>
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    {
                        isError ? (
                            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        ): (
                            undefined
                        )
                    }
                </View>
                <View style={[styles.half, styles.dFlex]}>
                    <View style={[styles.authMethod, styles.dFlex]}>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, gender ? undefined:styles.BtnDisabled]} disabled={gender ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                await submitGender()
                                if (!isError){navigationStack.navigate('EmailSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
}

const AddUserEmail = () => {
    const [userEmail, setUserEmail] = useState('')
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)

    const submitEmail = async () => {
        const res = await submitUserInfoHandler('email', userEmail)
        if (res){
            const jsonRes = res.data
            
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                AsyncStorage.setItem("@progress", '6')
            }   
        }else{
            
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.EMAIL_SUBMIT_TITLE}</Text>
                    <Text style={styles.text}>{defaultText.EMAIL_SUBMIT_CONTENT}</Text>
                </View>
                <View style={[styles.form, styles.dFlexRowStart, styles.half]}>
                    <View style={[styles.inputs, styles.dFlex]}>
                        <TextInput style={[styles.input]} placeholder="Email của bạn" autoCapitalize="none" onChangeText={setUserEmail}></TextInput>
                    </View>
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    {
                        isError ? (
                            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        ): (
                            undefined
                        )
                    }
                </View>
                <View style={[styles.half, styles.dFlex]}>
                    <View style={[styles.authMethod, styles.dFlex]}>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, userEmail ? undefined:styles.BtnDisabled]} disabled={userEmail ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                await submitEmail()
                                if (!isError){navigationStack.navigate('InterestSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
}

const AddUserInterest = () => {
    // const initInterest = []
    // for (let i=1; i<=9; i++){initInterest.push('')}
    const [userInterest, setUserInterest] = useState([''])
    const [interestSearchQuery, setInterestSearchQuery] = useState('')
    const [interestSearchResult, setInterestSearchResult] = useState([''])
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)
    let interestSearchList = ['']

    const userInterestSearchHandler = ()=>{
        for (let i=0; i<defaultText.ALL_INTEREST.length; i++){
            // const d = defaultText.ALL_INTEREST[i].length - interestSearchQuery.length
            const originInterest = defaultText.ALL_INTEREST[i].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            const compareInterest = interestSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            const d = originInterest.includes(compareInterest)
            const l = levenshtein(originInterest, compareInterest)

            if (interestSearchQuery && l <= 3 && d){
                if (interestSearchList.includes('')){interestSearchList.shift()}
                interestSearchList.push(defaultText.ALL_INTEREST[i])
            }
        }
        interestSearchList = interestSearchList.filter(e=>e != '')
        setInterestSearchResult(interestSearchList)
    }

    useEffect(()=>{
        userInterestSearchHandler()
    }, [interestSearchQuery])

    const submitInterest = async () => {
        const res = await submitUserInterestHandler('interest', userInterest)
        if (res){
            const jsonRes = res.data
            
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                AsyncStorage.setItem("@progress", '7')
            }   
        }else{
            
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
<ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex, styles.mgTopLg]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.INTEREST_SUBMIT_TITLE}</Text>
                    <Text style={styles.text}>{defaultText.INTEREST_SUBMIT_CONTENT}</Text>
                </View>
                <View style={[styles.form, styles.dFlexRowStart]}>
                    <View style={[styles.inputs, styles.dFlex]}>
                        <TextInput style={[styles.input]} placeholder="Sở thích của bạn" autoCapitalize="none" onChangeText={setInterestSearchQuery}></TextInput>
                    </View>
                    {/* <Text style={[styles.textBoldLg, styles.mgTopSm]}>{interestSearchResult}</Text> */}
                    <View style={[styles.hobbies]}>
                        {

                            userInterest.map((hobby: any)=>
                                hobby ? 
                                    <TouchableOpacity key={hobby} style={userInterest.includes(hobby) ? styles.hobbyBtnPress : styles.hobbyBtn} onPress={
                                        () => {
                                            const newUserInterest = userInterest
                                            newUserInterest.includes(hobby) ? newUserInterest.splice(userInterest.indexOf(hobby), 1) : newUserInterest.splice(newUserInterest.indexOf(hobby), 1, '')
                                            const results = newUserInterest.filter((e) => e != '')
                                            setUserInterest(results)
                                        }}>
                                        {
                                            userInterest.includes(hobby) ?
                                            <Text style={styles.hobbyTextPress}>{hobby}</Text>:
                                            <Text style={styles.hobbyText}>{hobby}</Text>
                                        }
                                    </TouchableOpacity>
                                    
                                    
                                    : (undefined)
                            )
                        }
                        {       
                            interestSearchResult ? (
                                interestSearchResult.map((hobby: any)=>
                                hobby && !userInterest.includes(hobby) ?
                                <TouchableOpacity key={hobby} style={userInterest.includes(hobby) ? styles.hobbyBtnPress : styles.hobbyBtn} onPress={
                                    () => {
                                        const newUserInterest = userInterest
                                        newUserInterest.includes(hobby) ? newUserInterest.splice(userInterest.indexOf(hobby), 1) : newUserInterest.push(hobby)
                                        const results = newUserInterest.filter((e) => e != '')
                                        setUserInterest(results)
                                    }}>
                                    {
                                        userInterest.includes(hobby) ?
                                        <Text style={styles.hobbyTextPress}>{hobby}</Text>:
                                        <Text style={styles.hobbyText}>{hobby}</Text>
                                    }
                                </TouchableOpacity>
                                : (undefined)
                            )): (undefined)          
                        }
                    </View>
                    
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    {
                        isError ? (
                            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        ): (
                            undefined
                        )
                    }
                </View>
                <View style={[styles.dFlex, styles.mgTopLg, styles.maxWidth]}>
                    <View style={[styles.authMethod, styles.dFlexSpaceBetween]}>
                        <TouchableOpacity style={[]} onPress={
                            async () => {
                                AsyncStorage.setItem("@progress", '7')
                                navigationStack.navigate('HeightSubmit')
                            }
                            }>
                            <Text style={[styles.textLink]}>Bỏ qua</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, userInterest ? undefined:styles.BtnDisabled]} disabled={userInterest ? false:true}  onPress={
                            async () => {
                                setWaiting(true)
                                await submitInterest()
                                if (!isError){navigationStack.navigate('HeightSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.mgBottom}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
        </ScrollView>        
    );
}

const AddUserHeight = () => {
    const [userHeight, setUserheight] = useState('')
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)

    const data = [
        "Không muốn tiết lộ"
    ]
    for (let i=91; i<=214; i++){
        data.push(i.toString() + ' cm')
    }
    data.push("Trên 214 cm")

    const heightList = [
        {
            title: "Chọn chiều cao của bạn",
            data: data
        }
    ]

    const setUserheightHandler = (item: any)=>{
        setUserheight(item)
    }

    const submitHeight = async () => {
        const res = await submitUserExtraHandler('height', userHeight)
        if (res){
            const jsonRes = res.data
            
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                AsyncStorage.setItem("@progress", '8')
            }   
        }else{
            
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.HEIGHT_SUBMIT_TITLE}</Text>
                    {/* <Text style={styles.text}>{defaultText.EMAIL_SUBMIT_CONTENT}</Text> */}
                </View>
                <View style={[styles.form, styles.dFlexRowStart]}>
                    <View style={[styles.inputs, styles.dFlex, styles.sections]}>
                    <SectionList 
                        sections={heightList}
                        renderItem={({ item }) => <Pressable key={item} delayLongPress={0} style={userHeight==item? styles.sectionItemPress: undefined} onPress={()=>{setUserheightHandler(item)}}><Text key={item} style={userHeight==item? styles.sectionItemTextPress : styles.sectionItemText}>{item}</Text></Pressable>}
                        // showsVerticalScrollIndicator={false}
                        // showsHorizontalScrollIndicator={false}
                    />
                    </View>
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    {
                        isError ? (
                            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        ): (
                            undefined
                        )
                    }
                </View>
                <View style={[styles.dFlex, styles.mgTopLg, styles.maxWidth]}>
                    <View style={[styles.authMethod, styles.dFlexSpaceBetween]}>
                        <TouchableOpacity style={[]} onPress={
                            async () => {
                                AsyncStorage.setItem("@progress", '8')
                                navigationStack.navigate('StarSignSubmit')
                            }
                            }>
                            <Text style={[styles.textLink]}>Bỏ qua</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, userHeight ? undefined:styles.BtnDisabled]} disabled={userHeight ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                await submitHeight()
                                if (!isError){navigationStack.navigate('StarSignSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.mgBottom}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
}

const AddUserStarSign = () => {
    const [starSign, setStarSign] = useState('')
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)

    const submitStarSign = async () => {
        const res = await submitUserExtraHandler('starSign', starSign)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                AsyncStorage.setItem("@progress", '9')
            }   
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.STARSIGN_SUBMIT_TITLE}</Text>
                </View>
                <View style={[styles.form, styles.dFlexRowStart, styles.half]}>
                    <ScrollView style={styles.sections} keyboardShouldPersistTaps={'handled'}>
                    {   
                        defaultText.STARSIGN_SUBMIT_ITEMS.map((element: any)=>
                            element ?
                            <View key={element} style={[styles.checkboxFrame]}>
                                <Text style={styles.textChoice}>{element}</Text>
                                <CheckBox
                                    value={starSign == element ? true: false}
                                    onValueChange={()=>{
                                        setStarSign(element)
                                    }}
                                />
                            </View>
                            : (undefined)
                        )
                    }
                    </ScrollView>
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    {
                        isError ? (
                            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        ): (
                            undefined
                        )
                    }
                </View>
                <View style={[styles.dFlex, styles.mgTopLg, styles.maxWidth]}>
                    <View style={[styles.authMethod, styles.dFlexSpaceBetween]}>
                        <TouchableOpacity style={[]} onPress={
                            async () => {
                                AsyncStorage.setItem("@progress", '9')
                                navigationStack.navigate('EducationLevelSubmit')
                            }
                            }>
                            <Text style={[styles.textLink]}>Bỏ qua</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, starSign ? undefined:styles.BtnDisabled]} disabled={starSign ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                await submitStarSign()
                                if (!isError){navigationStack.navigate('EducationLevelSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
}
const AddUserEducationLevel = () => {
    const [educationLevel, setEducationLevel] = useState('')
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)

    const submitEducationLevel = async () => {
        const res = await submitUserExtraHandler('educationLevel', educationLevel)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                AsyncStorage.setItem("@progress", '10')
            }   
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.EDUCATIONLEVEL_SUBMIT_TITTLE}</Text>
                </View>
                <View style={[styles.form, styles.dFlexRowStart, styles.half]}>
                    <ScrollView style={styles.sections} keyboardShouldPersistTaps={'handled'}>
                    {   
                        defaultText.EDUCATIONLEVEL_ITEMS.map((element: any)=>
                            element ?
                            <View key={element} style={[styles.checkboxFrame]}>
                                <Text style={styles.textChoice}>{element}</Text>
                                <CheckBox
                                    value={educationLevel == element ? true: false}
                                    onValueChange={()=>{
                                        setEducationLevel(element)
                                    }}
                                />
                            </View>
                            : (undefined)
                        )
                    }
                    </ScrollView>
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    {
                        isError ? (
                            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        ): (
                            undefined
                        )
                    }
                </View>
                <View style={[styles.dFlex, styles.mgTopLg, styles.maxWidth]}>
                    <View style={[styles.authMethod, styles.dFlexSpaceBetween]}>
                        <TouchableOpacity style={[]} onPress={
                            async () => {
                                AsyncStorage.setItem("@progress", '10')
                                navigationStack.navigate('DrinkingSubmit')
                            }
                            }>
                            <Text style={[styles.textLink]}>Bỏ qua</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, educationLevel ? undefined:styles.BtnDisabled]} disabled={educationLevel ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                await submitEducationLevel()
                                if (!isError){navigationStack.navigate('DrinkingSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
}
const AddUserDrinking = () => {
    const [drinking, setDrinking] = useState('')
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)

    const submitDrinking = async () => {
        const res = await submitUserExtraHandler('drinking', drinking)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                AsyncStorage.setItem("@progress", '11')
            }   
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.DRINKING_SUBMIT_TITLE}</Text>
                </View>
                <View style={[styles.form, styles.dFlexRowStart, styles.half]}>
                    <ScrollView style={styles.sections} keyboardShouldPersistTaps={'handled'}>
                    {   
                        defaultText.DRINKING_ITEMS.map((element: any)=>
                            element ?
                            <View key={element} style={[styles.checkboxFrame]}>
                                <Text style={styles.textChoice}>{element}</Text>
                                <CheckBox
                                    value={drinking == element ? true: false}
                                    onValueChange={()=>{
                                        setDrinking(element)
                                    }}
                                />
                            </View>
                            : (undefined)
                        )
                    }
                    </ScrollView>
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    {
                        isError ? (
                            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        ): (
                            undefined
                        )
                    }
                </View>
                <View style={[styles.dFlex, styles.mgTopLg, styles.maxWidth]}>
                    <View style={[styles.authMethod, styles.dFlexSpaceBetween]}>
                        <TouchableOpacity style={[]} onPress={
                            async () => {
                                AsyncStorage.setItem("@progress", '11')
                                navigationStack.navigate('SmokingSubmit')
                            }
                            }>
                            <Text style={[styles.textLink]}>Bỏ qua</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, drinking ? undefined:styles.BtnDisabled]} disabled={drinking ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                await submitDrinking()
                                if (!isError){navigationStack.navigate('SmokingSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
}
const AddUserSmoking = () => {
    const [smoking, setSmoking] = useState('')
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)

    const submitSmoking = async () => {
        const res = await submitUserExtraHandler('smoking', smoking)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                AsyncStorage.setItem("@progress", '12')
            }   
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.SMOKING_SUBMIT_TITLE}</Text>
                </View>
                <View style={[styles.form, styles.dFlexRowStart, styles.half]}>
                    <ScrollView style={styles.sections} keyboardShouldPersistTaps={'handled'}>
                    {   
                        defaultText.SMOKING_ITEMS.map((element: any)=>
                            element ?
                            <View key={element} style={[styles.checkboxFrame]}>
                                <Text style={styles.textChoice}>{element}</Text>
                                <CheckBox
                                    value={smoking == element ? true: false}
                                    onValueChange={()=>{
                                        setSmoking(element)
                                    }}
                                />
                            </View>
                            : (undefined)
                        )
                    }
                    </ScrollView>
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    {
                        isError ? (
                            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        ): (
                            undefined
                        )
                    }
                </View>
                <View style={[styles.dFlex, styles.mgTopLg, styles.maxWidth]}>
                    <View style={[styles.authMethod, styles.dFlexSpaceBetween]}>
                        <TouchableOpacity style={[]} onPress={
                            async () => {
                                AsyncStorage.setItem("@progress", '12')
                                navigationStack.navigate('ReligionSubmit')
                            }
                            }>
                            <Text style={[styles.textLink]}>Bỏ qua</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, smoking ? undefined:styles.BtnDisabled]} disabled={smoking ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                await submitSmoking()
                                if (!isError){navigationStack.navigate('ReligionSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
}
const AddUserReligion = () => {
    const [religion, setReligion] = useState('')
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)

    const submitReligion = async () => {
        const res = await submitUserExtraHandler('religion', religion)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                AsyncStorage.setItem("@progress", '13')
            }   
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.RELIGION_SUBMIT_TITLE}</Text>
                </View>
                <View style={[styles.form, styles.dFlexRowStart, styles.half]}>
                    <ScrollView style={styles.sections} keyboardShouldPersistTaps={'handled'}>
                    {   
                        defaultText.RELIGION_ITEMS.map((element: any)=>
                            element ?
                            <View key={element} style={[styles.checkboxFrame]}>
                                <Text style={styles.textChoice}>{element}</Text>
                                <CheckBox
                                    value={religion == element ? true: false}
                                    onValueChange={()=>{
                                        setReligion(element)
                                    }}
                                />
                            </View>
                            : (undefined)
                        )
                    }
                    </ScrollView>
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    {
                        isError ? (
                            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        ): (
                            undefined
                        )
                    }
                </View>
                <View style={[styles.dFlex, styles.mgTopLg, styles.maxWidth]}>
                    <View style={[styles.authMethod, styles.dFlexSpaceBetween]}>
                        <TouchableOpacity style={[]} onPress={
                            async () => {
                                AsyncStorage.setItem("@progress", '13')
                                navigationStack.navigate('BioSubmit')
                            }
                            }>
                            <Text style={[styles.textLink]}>Bỏ qua</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, religion ? undefined:styles.BtnDisabled]} disabled={religion ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                await submitReligion()
                                if (!isError){navigationStack.navigate('BioSubmit')}
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );
}
const AddUserBio = () => {
    const [bio, setBio] = useState('')
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false)
    const {isActive, setIsActive} = useLogin()


    const submitBio = async () => {
        const res = await submitUserInfoHandler('bio', bio)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                removeAsyncStorageItem("@progress")
            }   
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    const submitIsActive = async (isActive: string, value: boolean) => {
        const res = await submitUserHandler(isActive, value)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
                setIsError(false)
                setMessage(jsonRes.message)
                removeAsyncStorageItem("@progress")
                await AsyncStorage.setItem("@isActive", "true")
            }   
        }else{
            setIsError(true)
            setMessage(MESSAGES.SEND_CODE_ERROR)
        }
    }

    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={styles.dFlexColStart}>
                    <Text style={styles.heading}>{defaultText.BIO_SUBMIT_TITLE}</Text>
                    <Text style={styles.text}>{defaultText.BIO_SUBMIT_CONTENT}</Text>
                </View>
                <View style={[styles.form, styles.half]}>
                    <TextInput
                        multiline={true}
                        numberOfLines={7}
                        style={[styles.input, styles.mgTopSm, styles.textInputArea]} 
                        onChangeText={text => setBio(text)}
                    />
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    {
                        isError ? (
                            <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                        ): (
                            undefined
                        )
                    }
                </View>
                <View style={[styles.dFlex, styles.mgTopLg, styles.maxWidth]}>
                    <View style={[styles.authMethod, styles.dFlexSpaceBetween]}>
                        <TouchableOpacity style={[]} onPress={
                            async () => {
                                await submitIsActive("isActive", true)
                                if (!isError){
                                    navigationStack.navigate('AddUserInfoBeginDone')
                                }
                            }
                            }>
                            <Text style={[styles.textLink]}>Bỏ qua</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, bio ? undefined:styles.BtnDisabled]} disabled={bio ? false:true} onPress={
                            async () => {
                                setWaiting(true)
                                await submitBio()
                                if (!isError){
                                    await submitIsActive("isActive", true)
                                    if (!isError){
                                        navigationStack.navigate('AddUserInfoBeginDone')
                                    }
                                }
                            }
                            }>
                            {
                                waiting ? (
                                    <LottieView
                                        source={require('../public/lotties/loader.json')}
                                        style={{width: 50, height: 50}}
                                        autoPlay
                                    />
                                ):
                                <Text style={[styles.buttonText]}>Tiếp tục</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textCenter}>{defaultText.INFO_SHARING_PRIVACY}</Text>
                </View>
            </View>
        </View>
    );

}
const AddUserInfoBeginDone = () => {
    const {isActive, setIsActive} = useLogin()
    return (
        <View style={[styles.container, styles.dFlex]}>
            <View style={[styles.content, styles.dFlex]}>
                <View style={[styles.dFlex, styles.maxWidth]}>
                    <Text style={styles.heading}>{defaultText.USERINFO_BEGIN_DONE_TITLE}</Text>
                    <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex, styles.mgTopLg]} onPress={
                        async () => {
                            setIsActive(true)
                        }
                        }>
                        <Text style={[styles.buttonText]}>Đương nhiên</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export { AuthBegin, PhoneSubmiter, VerifyPhoneNumber, AddUserName, AddUserAge, AddUserAvatar, AddUserGender, AddUserEmail, AddUserInterest, AddUserHeight, AddUserStarSign, AddUserEducationLevel, AddUserDrinking, AddUserSmoking, AddUserReligion, AddUserBio, AddUserInfoBeginDone }


const styles = StyleSheet.create({
    dFlex: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dFlexRowStart: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    dFlexColStart: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    dFlexSpaceBetween: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexRow: {
        flexDirection: 'row',
    },
    mgTopLg: {
        marginTop: '15%',
    },
    mgTopSm: {
        marginTop: 20,
    },
    mgBottom: {
        marginBottom: '15%',
    },
    mgRight: {
        marginRight: 20,
    },
    halfWidth: {
        width: '50%'
    },
    maxWidth: {
        width: '100%',
    },
    maxHeight: {
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: DefaultColors.LIGHT_THEME,
        width: '100%',
        height: '100%',
    },
    half: {
        height: '50%',
        width: '100%',
    },
    content:{
        width: "85%",
        height: "85%",
        fontSize: 16,
        color: 'black',
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10
    },
    footer: {
        postition: 'fixed',
        bottom: 5
    },
    authMethod: {
        // width: '100%',
        marginBottom: 20
    },
    text: {
        color: 'black',
    },
    textCenter: {
        color: 'black',
        textAlign: 'center'
    },
    textBold: {
        color: 'black',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18,
        marginTop: 10
    },
    textBoldLg: {
        color: 'black',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 22,
        marginTop: 10
    },
    textChoice: {
        color: 'black',
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 18,
    },
    addAvatarFrame: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        marginTop: '50%',
        marginBottom: '10%',
        color: DefaultColors.GREY_DARK,
        minHeight: '30%'
    },
    addAvatarExtra: {
        width: '38%',
        // width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAvatarBtnFocus: {
        backgroundColor: DefaultColors.GREY,
    },
    addAvatarBtn1: {
        flex: 1,
        width: '100%',
        backgroundColor: DefaultColors.GREY_LIGHT,
        marginLeft: 20,
        marginBottom: 5,
        borderRadius: 6,
    },
    addAvatarBtn2: {
        flex: 1,
        width: '100%',
        backgroundColor: DefaultColors.GREY_LIGHT,
        marginLeft: 20,
        borderRadius: 6
    },
    addAvatarBtnMain: {
        width: '60%',
        height: '100%',
        backgroundColor: DefaultColors.GREY_LIGHT,
        borderRadius: 6,
        borderColor: 'transparent',
    },
    addAvaterIcon: {
        color: 'black',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18,
    },
    removeAvatarIconFrame: {
        backgroundColor: 'white',
        borderRadius: 50,
        position: 'absolute',
        bottom: 6,
        right: 6,
        padding: 3
    },
    removeAvatarIcon: {
        color: 'black',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18,
    },
    lightIcon: {
        color: 'white'
    },
    avatarThumbFrame: {width: '100%', height: '100%', overflow: 'hidden', borderRadius: 6, position: 'relative'},
    avatarThumb: {width: '100%', height: '100%', overflow: 'hidden', borderRadius: 6},
    tranparentBtn: {
        backgroundColor: 'None',
        borderWidth: 0,
    },
    textLink: {
        color: DefaultColors.BLUE,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
    },
    disableTextLink: {
        color: DefaultColors.GREY,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
    },
    form: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingBottom: '5%',
    },
    blueBtn: {
        backgroundColor: DefaultColors.BLUE
    },
    sections: {
        height: '100%',
        width: '100%'
    },
    sectionItemPress: {
        color: 'white',
        borderColor: DefaultColors.LIGHT_THEME,
        backgroundColor: DefaultColors.THEME,
        borderRadius: 30,
        borderWidth: 1,
        padding: 20,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10,
    },
    sectionItemText: {
        fontWeight: '600',
        fontSize: 18,
        padding: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    sectionItemTextPress: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
    },
    inputs: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        marginTop: '10%',
        marginBottom: '10%',
        color: DefaultColors.GREY_DARK
    },  
    input: {
        width: '100%',
        height: '90%',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: DefaultColors.THEME,
        fontSize: 16, 
        minHeight: 40,
        paddingLeft: 15
    },
    textInputArea: {
        textAlignVertical: 'top'
    },
    checkboxFrame: {
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        padding: 7,
        borderBottomWidth: 1,
        borderBottomColor: DefaultColors.THEME,
    },
    phoneCode: {
        width: '25%',
        marginRight: 5,
        paddingLeft: 0
    },
    phoneNumber: {
        width: '70%',        
        paddingLeft: 10
    },
    buttons: {
        // display: 'flex',
        width: '100%',
        // flexDirection: 'column',
        marginTop: '10%',
        marginBot: '10%',
    },
    button: {
        // width: '100%',
        backgroundColor: 'black',
        height: 45,
        paddingLeft: 50,
        paddingRight: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        marginBottom: 10
    },
    hobbies: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    hobbyBtn: {
        color: DefaultColors.THEME,
        borderColor: DefaultColors.LIGHT_THEME,
        backgroundColor: 'white',
        borderRadius: 30,
        paddingTop: 9,
        paddingBottom: 9,
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        marginRight: 5,
        marginTop: 5,
    },
    hobbyBtnPress: {
        color: DefaultColors.THEME,
        borderColor: DefaultColors.LIGHT_THEME,
        backgroundColor: DefaultColors.THEME,
        borderRadius: 30,
        paddingTop: 9,
        paddingBottom: 9,
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        marginRight: 5,
        marginTop: 5,
    },
    hobbyText: {
        // fontWeight: "500",
        color: 'black'
    },
    hobbyTextPress: {
        // fontWeight: "500",
        color: 'white'
    },
    confirmBtn: {
        height: 35,
        paddingLeft: 15,
        paddingRight: 15,
    },
    BtnDisabled: {
        backgroundColor: DefaultColors.GREY_DARK,
        opacity: 0.5
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '400'
    },
    buttonAlt: {
        width: '80%',
        borderWidth: 1,
        height: 40,
        borderRadius: 50,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    },
    buttonAltText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '400',
    },
    message: {
        fontSize: 13,
        // marginVertical: '5%',
    },
    codeFieldRoot: {marginTop: 0, padding: 0},
    cell: {
        width: 40,
        height: 55,
        lineHeight: 55,
        fontSize: 22,
        borderColor: DefaultColors.LIGHT_THEME,
        textAlign: 'center',
        backgroundColor: 'white',
        color: 'black',
        marginBottom: 15,
        marginRight: 10,
    },
    focusCell: {
        borderBottomColor: DefaultColors.THEME,
        borderBottomWidth: 3
    },
})
