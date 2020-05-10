
const recorder_api_url = process.env.REACT_APP_RECORDER_API
const getSocketUrl = ()=>{
    return recorder_api_url.replace('http', 'ws').replace('https', 'wss')
}

const getRecordUrl = (id, from = 0 ) =>{
    return recorder_api_url + "/records/" + id // + "/" + from ;
}
const deleteRecord = async (id) => {
    const res = await fetch(getRecordUrl(id), {
        method: 'DELETE',
    })
    const result = await res.json();
    return result.status || "error"
}
const getDownloadLink = (id, title) => {
    return recorder_api_url + '/records/download/' + id +"/" + title;
}

export default {
    getSocketUrl,
    getRecordUrl,
    deleteRecord,
    getDownloadLink,
}

