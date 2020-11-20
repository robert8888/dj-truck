import { Log, Logger } from "./../../utils/logger/logger";

const apiUrl = process.env.REACT_APP_SC_API_URL;
const maxResults = 10


export async function search(query = "", limit = maxResults) {
    const publicErrorMsg =  `Sorry during conectig to soundcloud api occured problem. Searching the soundlcoud database is not posible in this moment`
   
    const command = "/api/search?q=";
    const options = '&maxResults=' + limit;
    const url = apiUrl + command + encodeURI(query) + options;

    let data = await fetch(url).then(res => res.json()).catch( error => {
        Logger.push(Log.Error(
            ['api', 'soundcloud', 'search'],
            "Can't recive search data from soundcloud" + error.message,
            publicErrorMsg,
            error
        ))
    });

    return data;
}

export default {
    search,

    getUrl: (id) => {
        return apiUrl + `/api/download?id=` + id;
    },

    getStreamUrl: (id) => {
        return apiUrl + `/api/stream?id=` + id;
    },

    getUrlToExternall: async (id) => {
        const trackData = await fetch(apiUrl + "/api/resolve").then( res => res.json());
        if(!trackData) return "www.soundcloud.com";

        return trackData?.permalink_url;
    }
} 
