import client from './Client';
import { getAsyncStorageItem, removeAsyncStorageItem } from "../utils/AsyncStorage";

const getMeetings = async () => {
    const token =  await getAsyncStorageItem("@logintoken")
    if (token) {
        const res = await client.get("/meetings", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res
    }
    else {
        return false
    }
}

export {getMeetings}