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
    let headers = {}
    let body = null
    if (infoKey == 'avatar'){
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
        body = new FormData();
        for (let i = 0; i < infoValue.length; i++) {
            body.append('avatar', infoValue[i]);
        } 
    }
    else {
        headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        body = {
            infoKey: infoKey,
            infoValue: infoValue
        }
    }
    console.log(body)
    const res = await client.post('/addInfoBegin', body, {
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

export {submitPhonehandler, submitCodeHandler, submitInfoHandler, logout}