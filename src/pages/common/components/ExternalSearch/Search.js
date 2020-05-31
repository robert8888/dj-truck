import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, DropdownButton, FormControl } from "react-bootstrap";
import { connect } from "react-redux";
import { clearSearch, searchInput, searchStart } from "../../../../actions";
import { API_TYPES, getApisName } from "./../../../../apis/apiProvider";
import "./search.scss";
import SearchResults from './SerachResults/SearchResults.js';


const Search = ({
    clearSearch,
    searchStart,
    setQuery,
    queryString,
    controls,
    player,
}) => {
    const [resultOpen, setResultOpen] = useState(false);
    const [source, setSource] = useState(null);
    const [limit, setLimit] = useState(10);

    const openList = () => setResultOpen(true);

    useEffect(() => {
        const defaultSource = getApisName(API_TYPES.MIUSIC_SOURCE, { default: true })
        setSource(defaultSource)
    }, [setSource])

    const selectedHandel = () => {
        clearSearch();
        setResultOpen(false);
    }

    const apiList = useMemo(() => {
        return getApisName(API_TYPES.MIUSIC_SOURCE).map(api => {
            return (<Dropdown.Item key={api} onClick={setSource.bind(null, api)}>  {api} </Dropdown.Item>)
        })
    }, [])

    const controlKeyPress = useCallback((event) => {
        if (event.key !== "Enter") return
        searchStart(queryString, source, limit)
    }, [queryString, source, limit, searchStart])

    const clear = useCallback(()=>{
        clearSearch();
        setResultOpen(false);
    },[clearSearch, setResultOpen])

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
                {resultOpen && 
                    <Button className="btn-search-clear" onClick={clear}> 
                        Clear 
                    </Button>}
                <DropdownButton
                    className="btn-max-result-select"
                    title={limit}>
                    <Dropdown.Item onClick={() => setLimit(10)}> 10 </Dropdown.Item>
                    <Dropdown.Item onClick={() => setLimit(25)}> 25 </Dropdown.Item>
                    <Dropdown.Item onClick={() => setLimit(50)}> 50 </Dropdown.Item>
                </DropdownButton>
            </div>

            <SearchResults
                playback={controls?.playback}
                player={player}
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