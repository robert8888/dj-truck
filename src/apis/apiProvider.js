import youTubeApi from "./yt/ytApi";

export default function getApi(apiName){
        switch(apiName){
            case "YouTube": return youTubeApi;
    
            default : return null;
        }
}