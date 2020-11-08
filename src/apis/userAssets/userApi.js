import * as graphQlQueries from "./qlQueries";
import ApiCache from "./apiCache";
import hash from "hash-string";
const url = process.env.REACT_APP_USER_ASSETS_API;

const cache = new ApiCache();

export async function callQuery(query, token, variables, caching = false) {
    const body = JSON.stringify({
        query: query,
        variables: variables
    })

    const key = hash(body);
    if(cache.has(key) && caching){
        return cache.get(key)
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',

        },
        body
    })
    let data = await response.json();

    cache.set(key, data)
    return data;
}

export async function callQueryUploadSingle(query, token, variables){
    const body = new FormData();
    body.append(
        'operations',
        JSON.stringify({
            query,
            variables
        })
    )
    body.append('map', JSON.stringify({
        "0": ["variables.file"] 
    }))
    body.append('0', variables.file);
    
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
        },
        body
    }
    delete options.headers['Content-Type'];
    
    const response = await fetch(url, options)
    let json = await  response.json();
    return json;
}

export default {
    callQuery,
    callQueryUploadSingle,
    queries: graphQlQueries
}