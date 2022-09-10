import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMeetings } from '../api/Home';

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});

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
  }
  useEffect(() => {
    fetchUser()
  }, [])
  
  return (
    <LoginContext.Provider value={{ isLoading, setIsLoading, isLoggedIn, setIsLoggedIn, profile, setProfile, phoneNumber, setPhoneNumber}}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider