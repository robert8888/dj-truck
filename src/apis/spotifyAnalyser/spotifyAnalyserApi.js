import {Log, Logger} from "../../utils/logger/logger";

const apiUrl = process.env.REACT_APP_SPOTIFY_API_URL;

const getBpmAndOffset = async (query, duration) =>{
    let search = `/getbpm?q=${encodeURI(query)}&t=${duration}`
    return await fetch(apiUrl + search)
        .then(res => res.json())
        .catch(error => {
            Logger.push(Log.Error(
                ['api', 'spotify', 'analyser', "getBpmAndOffset"],
                "Can't receive search data from spotify analyser" + error.message,
                "Sorry during calling to spotify track analyser api occurred a problem",
                error
            ))
        });
}

export default {
    getBpmAndOffset,
}