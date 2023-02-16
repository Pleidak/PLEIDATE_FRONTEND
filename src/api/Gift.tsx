import client from './Client';
import { getAsyncStorageItem } from "../utils/AsyncStorage";


const getGiftCatchingRandom = async () => {
    const token =  await getAsyncStorageItem("@logintoken")
    if (token) {
        const res = await client.get('gifts/random-catching', {
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
const createGiftCatching = async (giftRemaining: any, giftId: string, name: string, rarity: string, caughtTime: any) => {
    const token =  await getAsyncStorageItem("@logintoken")
    if (token) {
        const res = await client.post('/gifts/caught',{
            giftRemaining: giftRemaining,
            giftId: giftId,
            caughtTime: caughtTime,
            name: name,
            rarity: rarity
        }, {
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

const getGiftColection = async () => {
    const token =  await getAsyncStorageItem("@logintoken")
    if (token) {
        const res = await client.get('/gifts/colection', {
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

export {getGiftCatchingRandom,createGiftCatching, getGiftColection}