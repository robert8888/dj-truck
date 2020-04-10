
const url = process.env.REACT_APP_USER_ASSETS_API;

export async function callQuery(query, token, variables) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',

        },
        body: JSON.stringify({
            query: query,
            variables: variables
        }),
    })
    let json = await response.json();
    return json;
}

export default {
    callQuery
}