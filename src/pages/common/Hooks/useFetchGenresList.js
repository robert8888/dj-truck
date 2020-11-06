import React, {useState, useCallback} from "react"
import {getApi} from "../../../apis/apiProvider";
import {Log, Logger} from "../../../utils/logger/logger";

export default  function (limit){

    const [items, setItems] = useState(null)

    const getLink = useCallback(to => `/records/genres/${to}`, [])

    const updateItems = useCallback(data => {
        setItems(data.map(genre => ({
            title: genre.name,
            link:  getLink(genre.name)
        })))
    }, [setItems])

    const fetchGenres = useCallback((limit) => {
        (async () =>{
            try{
                const { callQuery, queries } = getApi("UserAssets");
                const query = queries.getGenresListQl;
                const response = await callQuery(query, null , {limit})
                if(response.errors){
                    throw new Error(response.errors.map(error => error.message).join(" || "))
                } else {
                    updateItems(response.data.genres)
                }
            } catch(error){
                Logger.push(Log.Error(
                    ["component", "top genres", "fetch genres list"],
                    "Can't read genre list from server" + error.message,
                    error
                ))
            }

        })()
    }, [updateItems, limit])

    return [items, fetchGenres]
}