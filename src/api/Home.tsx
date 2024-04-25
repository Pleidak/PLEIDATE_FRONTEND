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

const getSuggestionUsers = async (userId: number) => {
    const token =  await getAsyncStorageItem("@logintoken")
    if (token) {
        const res = await client.get(`/users?userId=${userId}`, {
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

const likeUser = async (isLiked: boolean, meetOrSurf: boolean, userTarget: number) => {
    const token =  await getAsyncStorageItem("@logintoken")
    if (token) {
        const res = await client.post("/liked", {
            isLiked: isLiked,
            meetOrSurf: meetOrSurf,
            userTarget: userTarget
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

const getGiftColection = async (userId: number) => {
    const token =  await getAsyncStorageItem("@logintoken")
    if (token) {
        const res = await client.get(`/gifts?userId=${userId}`, {
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

const postGift = async (userId: number, userTarget: number, giftId: string, name: string, rarity: string, total: number, ownOrReceived: boolean, message: string) => {
    const token =  await getAsyncStorageItem("@logintoken")
    if (token) {
        const res = await client.post('gifts', {
            userId: userId, 
            userTarget: userTarget, 
            giftId: giftId, 
            name: name,
            rarity: rarity,
            total: total,
            ownOrReceived,
            message: message
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

export {getMeetings, likeUser, getGiftColection, postGift, getSuggestionUsers}