import youTubeApi from "./yt/ytApi";

const availableApis = [
    "YouTube",
    "SoundCloud"
]

export function getApi(apiName){
        switch(apiName){
            case "YouTube": return youTubeApi;
    
            default : return null;
        }
}

export function getAvailableApis(){
    return availableApis;
}

export function getDeafultApi(){
    return "YouTube"
}