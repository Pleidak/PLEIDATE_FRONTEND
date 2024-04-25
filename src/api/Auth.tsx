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
    return res
}

const submitUserHandler = async (infoKey: string, infoValue: any) => {
    const token = await getAsyncStorageItem("@logintoken")
    const res = await client.post('/add-user-begin', {
        infoKey: infoKey,
        infoValue: infoValue
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    return res
}

const submitUserInfoHandler = async (infoKey: string, infoValue: any) => {
    const token = await getAsyncStorageItem("@logintoken")
    const res = await client.post('/add-user-info-begin', {
        infoKey: infoKey,
        infoValue: infoValue
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    return res
}

const submitUserExtraHandler = async (infoKey: string, infoValue: any) => {
    const token = await getAsyncStorageItem("@logintoken")
    const res = await client.post('/add-user-extra-begin',{
        infoKey: infoKey,
        infoValue: infoValue
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    return res
}
const submitUserInterestHandler = async (infoKey: string, infoValue: any) => {
    var interest = infoValue.filter(function (el: any) {
        return el != null;
    });
    const token = await getAsyncStorageItem("@logintoken")
    const res = await client.post('/add-user-interest-begin',{
        infoKey: infoKey,
        infoValue: interest
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    return res
}

const submitMediaHandler = async (infoKey: string, infoValue: any) => {
    const token = await getAsyncStorageItem("@logintoken")
    const formData = new FormData();
    for (let i = 0; i < infoValue.length; i++) {
        if (infoValue[i].path && infoValue[i].order){
            formData.append('files', {
                name: new Date() + '_profile',
                uri: infoValue[i].path,
                type: infoValue[i].mime,
            });
            formData.append('order', infoValue[i].order)
        }
    } 
    const res = await client.post('/add-media', formData, {
        headers:  {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    })
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

export {submitPhonehandler, submitCodeHandler, submitUserInfoHandler, submitUserExtraHandler, submitMediaHandler, submitUserInterestHandler, submitUserHandler, logout}