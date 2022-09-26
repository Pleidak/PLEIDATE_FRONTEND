import client from './Client';
import { getAsyncStorageItem } from '../utils/AsyncStorage';

const submitPhonehandler = async (phone: string) => {
    const res = await client.post('/login', {
        phone: phone
    },{
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return res
}

const submitCodeHandler = async (phone: string, code: string) => {
    const res = await client.post('/verify', {
        phone: phone,
        code: code
    },{
        headers: {
            'Content-Type': 'application/json',
        }
    })
    console.log(res)
    return res
}

const submitInfoHandler = async (infoKey: string, infoValue: any) => {
    console.log(infoKey)
    console.log(infoKey)
    const token = await getAsyncStorageItem("@logintoken")
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    const body = {
        infoKey: infoKey,
        infoValue: infoValue
    }
    const res = await client.post('/addInfoBegin', body, {
        headers: headers
    })
    console.log(res)
    return res
}

const submitMediaHandler = async (infoKey: string, infoValue: any) => {
    console.log(infoKey)
    console.log(infoKey)
    const token = await getAsyncStorageItem("@logintoken")
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
    }
    const formData = new FormData();
    for (let i = 0; i < infoValue.length; i++) {
        formData.append('files', {
            name: new Date() + '_profile',
            uri: infoValue[i].uri,
            type: infoValue[i].type,
          });
    } 
    const res = await client.post('/addMedia', formData, {
        headers: headers
    })
    console.log(res)
    return res
}


const logout = async ()=> {
    const token = await getAsyncStorageItem("@logintoken")
    if (token){
        const res = await client.get("/logout", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (res.status == 200){return true}
        else {return false}
    }
    else {return false}
   
}

export {submitPhonehandler, submitCodeHandler, submitInfoHandler, submitMediaHandler, logout}