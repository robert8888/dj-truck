import youTubeApi from "./yt/ytApi";
import userAssetsApi from "./userAssets/userApi";

export const API_TYPES = {
    MIUSIC_SOURCE: "Source of miusic",
    DATA_SOURCE: {
        GRAPHQL: "GraphQl api",
        REST: "Rest api"
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
