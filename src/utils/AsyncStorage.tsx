import AsyncStorage from "@react-native-async-storage/async-storage"

const getAsyncStorageItem = async (key: string) => {
    try {
        const token = await AsyncStorage.getItem(key)
        if (token !== null) {return token}
        else {return false}
    }
    catch(err){
        console.log(err)
        return false
    }
}
const removeAsyncStorageItem = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key)
        return true
    }
    catch(err){
        console.log(err)
        return false
    }
}

export {AsyncStorage, getAsyncStorageItem, removeAsyncStorageItem}