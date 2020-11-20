import localForage from "localforage"

export default async function cacheFile(key, response){
    const blob = await response.blob();
    const stored = await localForage.setItem(key, blob)
    return {
        key, stored
    }
}

export async function cacheFromUrl(url){
    const response = await fetch(url);
    return await cacheFile(url, response)
}

export async function cacheFromUrls(urls){
    const calls = urls.map(url => {
        return cacheFromUrl(url)
    })
    return await Promise.all(calls);
}