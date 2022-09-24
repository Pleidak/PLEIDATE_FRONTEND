import client from './Client';
import { getAsyncStorageItem, removeAsyncStorageItem } from "../utils/AsyncStorage";

const getMeetings = async () => {
    const token =  await getAsyncStorageItem("@logintoken")
    console.log(token)
    if (token) {
        const res = await client.get("/meetings", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(1)
        return res
    }
    else {
        console.log(2)
        return false
    }
}

export {getMeetings}