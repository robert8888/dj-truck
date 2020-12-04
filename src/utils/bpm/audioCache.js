import localForage from "localforage"

export default async function cacheFile(key, response){
    const blob = await response.blob();
    const data = await localForage.setItem(key, blob);
    return {
        key, data
    }
}

export async function cacheFromUrl(url, meta){
    const response = await fetch(url);
    return {
         ...meta,
        store: await cacheFile(url, response)
    }
}

export async function cacheTracks(tracks){
    const calls = tracks.map(track => {
        return cacheFromUrl(track.url, {id: track.id})
    })
    return await Promise.all(calls);
}