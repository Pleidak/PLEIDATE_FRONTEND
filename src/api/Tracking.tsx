import client from './Client';
import { getAsyncStorageItem } from "../utils/AsyncStorage";

const postTracking = async (longtitude: number, latitude: number, timestamp: string) => {
    const token =  await getAsyncStorageItem("@logintoken")
    if (token) {
        const res = await client.post("/tracking", {
            longtitude: longtitude,
            latitude: latitude,
            timestamp: timestamp
        },{
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

export {postTracking}