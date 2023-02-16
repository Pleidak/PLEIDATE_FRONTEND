import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMeetings } from '../api/Home';
import { getAsyncStorageItem, removeAsyncStorageItem } from '../utils/AsyncStorage';

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(1);
  const [profile, setProfile] = useState({});
  const [joinStatus, setJoinStatus] = useState(false)
  const [userInfo, setUserInfo] = useState({userId: 0, mainAvatar: ''})
  

  const fetchUser = async () => {
    // const getMeetingrRes = await getMeetings()
    // if (getMeetingrRes){
    //   setIsLoggedIn(true)
    // }
    // else {
    //   setIsLoading(false)
    // }

    await getAsyncStorageItem("@logintoken").then((getIsLogin)=>{
      if (getIsLogin){
        setIsLoggedIn(true)
      }
    })

    await getAsyncStorageItem("@isActive").then((getIsActive)=>{
      if (getIsActive == "true"){
        setIsActive(true)
      }
      setIsLoading(false)
    })

    await getAsyncStorageItem("@userInfo").then((getUserInfo)=>{
      if (getUserInfo){
        setUserInfo(JSON.parse(getUserInfo))
      }
      setIsLoading(false)
    })

    // await removeAsyncStorageItem("@logintoken")
    // await removeAsyncStorageItem("@isActive")

    await getAsyncStorageItem("@progress").then((getProgress)=>{
      if (getProgress){
        setProgress(parseInt(getProgress))
      }
      setIsLoading(false)
    })
  }

  useEffect(() => {
    fetchUser()
  }, [])
  
  return (
    <LoginContext.Provider value={{ isLoading, setIsLoading, isLoggedIn, setIsLoggedIn, profile, setProfile, phoneNumber,
     setPhoneNumber, joinStatus, setJoinStatus, isActive, setIsActive, progress, setProgress, userInfo, setUserInfo}}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider