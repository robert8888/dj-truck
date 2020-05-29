const apiUrl = process.env.REACT_APP_SC_API_URL;
const maxResults = 10

export async function search(query = "", limit = maxResults) {

    const comand = "/search?q=";
    const options = '&maxResults=' + limit;
    const url = apiUrl + comand + encodeURI(query) + options;
    let response = await fetch(url);
    return await response.json();
}

export default {
    search,

    getUrl: (id) => {
        const slash = (!apiUrl.endsWith("/")) ? "/" : "";
        return apiUrl + `${slash}download?id=` + id;
    },

    getUrlToExternall: (id) => {
        return "https://www.youtube.com/watch?v=" + id;
    }
} 
