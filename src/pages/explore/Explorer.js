import React , {useEffect, useCallback} from "react";
import "./explorer.scss";
import RecordSearch from "../common/components/RecordSearch/RecordSearch";
import { useHistory } from "react-router-dom";
import useRecordSearchUrl from "../common/Hooks/useRecordSearchURL";

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
    }, )
    return (
        <div className="explor">
            <RecordSearch title="Dj Trucks" onSearch={onSearch}/>
        </div>
    )
}

export default Explorer