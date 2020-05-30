import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import RecordSearch from "../common/components/RecordSearch/RecordSearch";
import useRecordSearchUrl from "../common/Hooks/useRecordSearchURL";
import "./explorer.scss";

const Explorer = props =>{
    const history = useHistory();
    const [getSearchUrl] = useRecordSearchUrl();

    useEffect(()=>{
        document.body.classList.add("page-explorer");
        return () => {
            console.log("remove")
            document.body.classList.remove("page-explorer");
        }
    })
    const onSearch = useCallback((queryStr, serachOpt)=>{
        const url = getSearchUrl(queryStr, {serachOpt});
        history.push(url);
    }, [getSearchUrl, history] )
    
    return (
        <div className="explor">
            <RecordSearch title="Dj Trucks" onSearch={onSearch}/>
        </div>
    )
}

export default Explorer