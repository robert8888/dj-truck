import { Log, Logger } from "./../../utils/logger/logger";

const apiUrl = process.env.REACT_APP_YT_API_URL;
const maxResults = 10

export async function search(query = "", limit = maxResults){
    const publicErrorMsg =  `Sorry during conectig to youtube api occured problem. Searching the youtube database is not posible in this moment`
   
    const comand =  "/search?q=";
    const options = '&maxResults=' + limit ;
    const url = apiUrl + comand + encodeURI(query) + options;

    let data = await fetch(url).then(res => res.json()).catch( error => {
        Logger.push(Log.Error(
            ['api', 'youtube', 'search'],
            "Can't recive search data from youtube" + error.message,
            publicErrorMsg,
            error
        ))
    });

    return data;
}

export default {
    search,

    getUrl : (id) => {
        return apiUrl + "/api/download?url=https://www.youtube.com/watch?v=" + id ; 
    },

    getStreamUrl: (id) => {
        return apiUrl + "/api/stream?url=https://www.youtube.com/watch?v=" + id ; 
    },

    getUrlToExternall : (id) => {
        return "https://www.youtube.com/watch?v=" + id;
    }
} 
