
const recorder_api_url = process.env.REACT_APP_RECORDER_API
const getSocketUrl = ()=>{
    return recorder_api_url.replace('http', 'ws').replace('https', 'wss')
}

const getRecordUrl = (id) =>{
    return recorder_api_url + "/records/" + id 
}

const getStreamUrl = id => getRecordUrl(id);


const getDownloadLink = (id, title) => {
    return recorder_api_url + '/records/download/' + id +"/" + title;
}

const deleteRecord = async (id) => {
    console.log(getRecordUrl(id))
    const res = await fetch(getRecordUrl(id), {
        method: 'DELETE',
    })
    console.log(res)
    const result = await res.json();
    return result.status || "error"
}

export default {
    getSocketUrl,
    getRecordUrl,
    getStreamUrl,
    deleteRecord,
    getDownloadLink,
}

