import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dropdown, DropdownButton, FormControl } from "react-bootstrap";
import { connect } from "react-redux";
import { clearSearch, searchInput, searchStart } from "../../../../actions";
import { API_TYPES, getApisName } from "./../../../../apis/apiProvider";
import "./search.scss";
import SearchResults from './SerachList/SearchList.js';





const Search = ({
    clearSearch,
    searchStart,
    setQuery,
    queryString,
}) => {
    const [resultOpen, setResultOpen] = useState(false);
    const [source, setSource] = useState(null);
    const [limit, setLimit] = useState(10);

    const openList = () => setResultOpen(true);

    useEffect(()=>{
        const defaultSource = getApisName(API_TYPES.MIUSIC_SOURCE, { default: true })
        setSource(defaultSource)
    }, [API_TYPES, getApisName, setSource])

    const selectedHandel = () => {
        clearSearch();
        setResultOpen(false);
    }

    const apiList = useMemo(()=>{
        return getApisName(API_TYPES.MIUSIC_SOURCE).map(api => {
            return (<Dropdown.Item key={api} onClick={setSource.bind(null, api)}>  {api} </Dropdown.Item>)
        })
    }, [API_TYPES.MIUSIC_SOURCE, getApisName])

    const controlKeyPress = useCallback((event) => {
        if (event.key !== "Enter") return
        console.log("soruce in coimponet", source)
        searchStart(queryString, source, limit)
    }, [queryString, source, limit])

    return (
        <div className="search">
            <div className="search-controls">
                <DropdownButton
                    className="btn-api-select"
                    title={source || ""}>
                    {apiList}
                </DropdownButton>
                <FormControl
                    className="search-control"
                    type="text"
                    placeholder="Tap in to serach on youtube"
                    onChange={event => setQuery(event.target.value)}
                    onKeyPress={controlKeyPress}
                    onFocus={openList}
                    value={queryString} />
                <DropdownButton
                    className="btn-max-result-select"
                    title={limit}>
                    <Dropdown.Item onClick={() => setLimit(10)}> 10 </Dropdown.Item>
                    <Dropdown.Item onClick={() => setLimit(25)}> 25 </Dropdown.Item>
                    <Dropdown.Item onClick={() => setLimit(50)}> 50 </Dropdown.Item>
                </DropdownButton>


            </div>

            <SearchResults
                open={resultOpen}
                selectedHandle={selectedHandel} />
        </div>
    );
}

const mapStateToProps = state => ({
    queryString: state.searchReducer.searchString
})

const mapDispachToProps = dispatch => ({
    setQuery: (text) => dispatch(searchInput(text)),
    searchStart: (text, source, limit) => dispatch(searchStart(text, source, limit)),
    clearSearch: () => dispatch(clearSearch()),
})

export default connect(mapStateToProps, mapDispachToProps)(Search);