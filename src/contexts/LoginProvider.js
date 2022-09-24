import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMeetings } from '../api/Home';
import { getAsyncStorageItem, removeAsyncStorageItem } from '../utils/AsyncStorage';

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isActive, setisActive] = useState(false);
  const [profile, setProfile] = useState({});
  const [joinStatus, setJoinStatus] = useState(false)


  const fetchUser = async () => {
    const getMeetingrRes = await getMeetings()
    if (getMeetingrRes){
      setIsLoggedIn(true)
      setIsLoading(false)
    }
    else {
      setIsLoggedIn(false)
      setIsLoading(false)
    }

    // await removeAsyncStorageItem('@logintoken')

    const getIsActive = await getAsyncStorageItem("@isActive")
    console.log("234", getIsActive)
    if (getIsActive == "true"){
      setisActive(true)
      setIsLoading(false)
      setIsLoggedIn(true)
    }
    else {
      setIsLoggedIn(false)
      setisActive(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])
  
  return (
    <LoginContext.Provider value={{ isLoading, setIsLoading, isLoggedIn, setIsLoggedIn, profile, setProfile, phoneNumber, setPhoneNumber, joinStatus, setJoinStatus, isActive, setisActive}}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider