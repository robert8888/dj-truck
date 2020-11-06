import React, {useState, useCallback} from "react";
import {Form} from "react-bootstrap";
import "./record-search.scss"
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const RecordSearch = ({onSearch, title}) =>{
    const [query, setQuery] = useState("");
    const [searchOpt, setSearchOpt] = 
        useState({title: true, artist: true, description: true })

    const setQueryHandler = useCallback( event =>{
        setQuery(event.target.value)
    }, [setQuery])

    const onKeyDown = useCallback( event => {
        if(event.key === "Enter" && onSearch){
            onSearch(query, searchOpt)
        }
    }, [onSearch, query, searchOpt]) 

    const changeOpt = useCallback( varName => {
        setSearchOpt( opt => ({
            ...opt,
            [varName]: !opt[varName],
        }))
    }, [setSearchOpt])


    return (
        <ErrorBoundary>
            <div className="record-search">
                <div className="record-search-container">
                    <h4 className={"record-search__title"}>{title}</h4>
                    <Form.Control 
                        className="record-search-control" 
                        type="text" 
                        value={query} 
                        onChange={setQueryHandler}
                        onKeyDown={onKeyDown}/>
                    <div className="record-search-options">
                        <h5>Serach in: </h5>
                        <Form.Check 
                            className="search-option" 
                            inline 
                            label="titles" 
                            type="checkbox" 
                            checked={searchOpt.title}
                            onChange={changeOpt.bind(null, 'title')}
                            id="serach-opt-title"/>
                        <Form.Check 
                            className="search-option"   
                            inline 
                            label="artist" 
                            type="checkbox" 
                            checked={searchOpt.artist}
                            onChange={changeOpt.bind(null, 'artist')}
                            id="serach-opt-artis"/>
                        <Form.Check
                            className="search-option" 
                            inline 
                            label="description" 
                            type="checkbox"
                            checked={searchOpt.description} 
                            onChange={changeOpt.bind(null, 'description')}
                            id="serach-opt-description"/>
                    </div>
                </div>
            </div>
        </ErrorBoundary>

    )
}


export default RecordSearch;