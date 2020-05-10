import youTubeApi from "./yt/ytApi";
import userAssetsApi from "./userAssets/userApi";
import recordStoreApi from "./recordsStore/recStoreApi";

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
        default: true
    },
    "SoundCloud": {
        type: API_TYPES.MIUSIC_SOURCE,
        api: null,
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
