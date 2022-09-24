import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Pressable, Image, FlatList } from 'react-native';
// import { CallingCodePicker } from '@digieggs/rn-country-code-picker';
// import {CountryPicker} from "react-native-country-codes-picker";
import CountryPicker from 'react-native-country-picker-modal'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { submitPhonehandler, submitCodeHandler, submitInfoHandler } from '../api/Auth';
import { MESSAGES } from '../constants/Messages';
import authStyle from '../public/AuthStyles';
import { useLogin } from '../contexts/LoginProvider';
import { navigationStack } from './NavigationStack';
import { color } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { defaultText } from '../constants/DefaultTexts';
import { Button } from 'react-native-elements';
import { CountryCode, Country, countryPhoneCode } from '../utils/countryCodeType'
import { fonts } from 'react-native-elements/dist/config';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


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
        }
        else {
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
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex]} onPress={
                            async () => {
                                const absolutePhone = await submitPhone()
                                setPhoneNumber(absolutePhone)
                                if (!isError){navigationStack.navigate('CodeSubmit')}
                            }
                            }>
                            <Text style={[styles.buttonText]}>Tiếp tục</Text>
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
    const { phoneNumber, isLoggedIn, setIsLoggedIn } = useLogin()
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [value, setValue] = useState('');
    const [disabled, setDisabled] = useState(true)
    const [countRemaining, setCountRemaining] = useState(60)
    const [isActive, setIsActive] = useState(false)
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });

    const resendCodeTimeout = () => {
        const timeout = setTimeout(() => {
            if (countRemaining != 0) {
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
    

    // const resendCodeTimeout = () =>{
    //     setTimeout(() =>{
    //         setDisabled(false)
    //     }, 60*1000)
    // }

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
        }
        else {
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
                setMessage(jsonRes.message)
                if (jsonRes.isActive){
                    // AsyncStorage.setItem("@locationToken", jsonRes.locationToken)
                    setIsActive(true)
                    AsyncStorage.setItem("@isActive", jsonRes.isActive.toString())
                }
               
            }   
        }
        else {
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
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex]} onPress={
                            async () => {
                                await submitCode()
                                if (!isError) {
                                    setIsLoggedIn(true)
                                    // navigationStack.navigate('NameSubmit')
                                }
                            }
                            }>
                            <Text style={[styles.buttonText]}>Tiếp tục</Text>
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

    const submitName = async () => {
        const res = await submitInfoHandler('name', userName)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
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
                    <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                </View>
                <View style={[styles.half, styles.dFlex]}>
                    <View style={[styles.authMethod, styles.dFlex]}>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex]} onPress={
                            async () => {
                                await submitName()
                                if (!isError){navigationStack.navigate('AvatarSubmit')}
                            }
                            }>
                            <Text style={[styles.buttonText]}>Xác nhận</Text>
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
    const [userAvatar, setUserAvatar] = useState([''])
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(0);

    const addAvatar = (data: any, userAvatar: any) => {
        const avatars = []
        console.log(data)
        if (data && (data.length + userAvatar.length) <= 3){
            for (let i=0; i<data.length; i++){
                avatars.push(data[i].uri)
            }
            console.log(avatars)
            console.log(userAvatar)
            const newAvatarObj = userAvatar.concat(avatars)
            const results = newAvatarObj.filter((element: any) => {
                if (Object.keys(element).length !== 0) {
                  return true;
                }
              
                return false;
            })
            console.log(results)
            setUserAvatar(results)
        }
    }

    const removeAvatar = (data: any, userAvatar: any) => {
        const avatars = userAvatar
        if (data && userAvatar.length > 0){
            userAvatar.splice(data, 1)
            setUserAvatar(userAvatar)
        }
    }

    const openImageLibrary = async () => {
        const result = await launchImageLibrary({mediaType:'photo', selectionLimit: 3});
        // console.log(result.assets)
        // setUserAvatar(userAvatar => ({
        //     ...userAvatar,
        //     ...result.assets
        //   }))
        const data = result?.assets;
        addAvatar(data, userAvatar)
      };
    

    const submitName = async () => {
        const res = await submitInfoHandler('avatar', userAvatar)
        if (res){
            const jsonRes = res.data
            if (res.status !== 200) {
                setIsError(true)
                setMessage(jsonRes.message)
            } else {
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
                            onPress={openImageLibrary}>
                            {
                                userAvatar[0] ? 
                                (
                                    <Image key='{key}' source={{uri: userAvatar[0]}} style={styles.avatarThumb} />
                                ):(
                                    <Text style={styles.addAvaterIcon}>+</Text>
                                )
                            }
                        </TouchableOpacity>
                        <View style={[styles.addAvatarExtra]}>
                            <TouchableOpacity
                                style={[styles.addAvatarBtn1, styles.dFlex]}
                                onPress={openImageLibrary}>
                                {
                                    userAvatar[1] ? 
                                    (
                                        <Image source={{uri: userAvatar[1]}} style={styles.avatarThumb} />
                                    ):(
                                        <Text style={styles.addAvaterIcon}>+</Text>
                                    )
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.addAvatarBtn2, styles.dFlex]}
                                onPress={openImageLibrary}>
                                {
                                    userAvatar[2] ? 
                                    (
                                        <Image source={{uri: userAvatar[2]}} style={styles.avatarThumb} />
                                    ):(
                                        <Text style={styles.addAvaterIcon}>+</Text>
                                    )
                                }
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                    {console.log(userAvatar)}
                </View>
                <View style={[styles.dFlexRowStart, styles.flexRow]}>
                    <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? message : null}</Text>
                </View>
                <View style={[styles.half, styles.dFlex]}>
                    <View style={[styles.authMethod, styles.dFlex]}>
                        <TouchableOpacity style={[styles.button, styles.confirmBtn, styles.dFlex]} onPress={
                            async () => {
                                await submitName()
                                if (!isError){navigationStack.navigate('AvatarSubmit')}
                            }
                            }>
                            <Text style={[styles.buttonText]}>Xác nhận</Text>
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
        alignItems: 'center',
    },
    dFlexColStart: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    flexRow: {
        flexDirection: 'row',
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
        backgroundColor: Colors.LIGHT_THEME,
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
        bottom: '10%'
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
    addAvatarFrame: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        marginTop: '50%',
        marginBottom: '10%',
        color: Colors.GREY_DARK,
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
        backgroundColor: Colors.GREY,
    },
    addAvatarBtn1: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.GREY_LIGHT,
        marginLeft: 20,
        marginBottom: 5,
        borderRadius: 6,
    },
    addAvatarBtn2: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.GREY_LIGHT,
        marginLeft: 20,
        borderRadius: 6
    },
    addAvatarBtnMain: {
        width: '60%',
        height: '100%',
        backgroundColor: Colors.GREY_LIGHT,
        borderRadius: 6,
        borderColor: 'transparent',
    },
    addAvaterIcon: {
        color: 'black',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18,
    },
    avatarThumb: {width: '100%', height: '100%', overflow: 'hidden', borderRadius: 6},
    tranparentBtn: {
        backgroundColor: 'None',
        borderWidth: 0,
    },
    textLink: {
        color: Colors.BLUE,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
    },
    disableTextLink: {
        color: Colors.GREY,
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
        backgroundColor: Colors.BLUE
    },
    inputs: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        marginTop: '10%',
        marginBottom: '10%',
        color: Colors.GREY_DARK
    },  
    input: {
        width: '100%',
        height: '90%',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        fontSize: 16, 
        minHeight: 40,
        paddingLeft: 15
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
    confirmBtn: {
        height: 35,
        paddingLeft: 15,
        paddingRight: 15,
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
        borderColor: Colors.LIGHT_THEME,
        textAlign: 'center',
        backgroundColor: 'white',
        color: 'black',
        marginBottom: 15,
        marginRight: 10,
    },
    focusCell: {
        borderBottomColor: 'black',
        borderBottomWidth: 3
    },
})

export { AuthBegin, PhoneSubmiter, VerifyPhoneNumber, AddUserName, AddUserAvatar }