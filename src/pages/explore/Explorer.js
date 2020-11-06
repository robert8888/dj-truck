import React, { useCallback, useEffect } from "react";
import {Link, useHistory} from "react-router-dom";
import RecordSearch from "../common/components/RecordSearch/RecordSearch";
import useRecordSearchUrl from "../common/Hooks/useRecordSearchURL";
import {Container} from "react-bootstrap";
import TopGenres from "../common/components/TopGenres/TopGenres";
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
        <Container className="app layout container-xl" >
            <div className="c-explorer">
                <RecordSearch title="Dj Truck records" onSearch={onSearch}/>
                <TopGenres/>
                <Link to={"/genres"} className={"c-explorer__link"}>See all genres</Link>
            </div>
        </Container>
    )
}

export default Explorer