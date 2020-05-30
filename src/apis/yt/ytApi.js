const apiUrl = process.env.REACT_APP_YT_API_URL;
const maxResults = 10

export async function search(query = "", limit = maxResults){
    //console.log(url);
    const comand =  "/search?q=";
    const options = '&maxResults=' + limit ;
    const url = apiUrl + comand + encodeURI(query) + options;

    let response = await fetch(url);
    return await response.json();
}

export default {
    search,

    getUrl : (id) => {
        return apiUrl + "/download?url=https://www.youtube.com/watch?v=" + id ; 
    },

    getStreamUrl: (id) => {
        return apiUrl + "/download?url=https://www.youtube.com/watch?v=" + id ; 
    },

    getUrlToExternall : (id) => {
        return "https://www.youtube.com/watch?v=" + id;
    }
} 
