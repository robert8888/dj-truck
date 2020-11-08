import React, {useState, useCallback} from "react"
import {getApi} from "../../../apis/apiProvider";
import {Log, Logger} from "../../../utils/logger/logger";
import {useDispatch, useSelector} from "react-redux";
import {loadRecords} from "../../../actions";

export default  function (){
    const token = useSelector(state => state.user.token)
    const dispatch = useDispatch();
    const [list, setList] = useState({})

    const fetchRecords = useCallback((pageSize, page, where) => {
        (async () =>{
            try{
                const { callQuery, queries } = getApi("UserAssets");
                const variables = { ...where };
                variables.pageSize = pageSize;
                variables.page = page;
                const query = queries.recordsQl;
                const response = await callQuery(query, token, variables);


                if(response.errors){
                    throw new Error(response.errors.map(error => error.message).join(" || "))
                } else {
                    const records = response?.data?.records?.records;
                    const countAll = response?.data?.records?.countAll;
                    setList({
                        records,
                        countAll,
                    })
                    dispatch(loadRecords(records, countAll))
                }
            } catch(error){
                Logger.push(Log.Error(
                    ["hooks", "fetch records list"],
                    "Can't fetch record list from server" + error.message,
                    error
                ))
            }

        })()
    }, [setList, token])

    return [list, fetchRecords]
}