import recordStoreApi from "./recordsStore/recStoreApi";
import soundCloudApi from "./sc/scApi";
import userAssetsApi from "./userAssets/userApi";
import youTubeApi from "./yt/ytApi";
import spotifyAnalyserApi from "./spotifyAnalyser/spotifyAnalyserApi";

export const API_TYPES = {
    MIUSIC_SOURCE: "Source of miusic",
    DATA_SOURCE: {
        GRAPHQL: "GraphQl api",
        REST: "Rest api",
        WEB_SOCKET: "Api with web socket connection"
    }
}


const apisMap = {
    "YouTube": {
        type: API_TYPES.MIUSIC_SOURCE,
        api: youTubeApi,
    },
    "SoundCloud": {
        type: API_TYPES.MIUSIC_SOURCE,
        api: soundCloudApi,
        default: true
    },

    "SpotifyAnalyser":{
        type: API_TYPES.DATA_SOURCE.REST,
        api: spotifyAnalyserApi,
    },

    "UserAssets": {
        type: API_TYPES.DATA_SOURCE.GRAPHQL,
        api: userAssetsApi,
    },

    "RecordsStore": {
        type: [
            API_TYPES.DATA_SOURCE.WEB_SOCKET, 
            API_TYPES.DATA_SOURCE.REST
        ],
        api: recordStoreApi,
    }
}

export function getApi(apiName) {
    return apisMap[apiName].api;
}

export function getApisName(type, param) {
    if (!type && !param) {
        return Object.keys(apisMap)
    } else if (type) {
        return Object.entries(apisMap)
            .filter(([_, api]) => {
                const typeCorrent = (api.type === type)
                if (!param) {
                    return typeCorrent
                } else {
                    const paramCorrect =
                        Object.entries(param).every(([key, value]) =>
                            api[key] === value
                        )
                    return (typeCorrent && paramCorrect);
                }
            })
            .map(([name, _]) => name)
    }
}
