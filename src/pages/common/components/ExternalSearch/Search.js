import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, DropdownButton, FormControl } from "react-bootstrap";
import { connect } from "react-redux";
import { clearSearch, searchInput, searchStart } from "actions";
import { API_TYPES, getApisName } from "apis/apiProvider";
import { Spin } from "react-loading-io";
import ErrorBoundary from "./../ErrorBoundary/ErrorBoundary";
import classNames from "classnames"
import SearchResults from './SerachResultsList/SearchResultsList.js';
import "./search.scss";

const Search = ({
    clearSearch,
    searchStart,
    searchStatus,
    setQuery,
    queryString,
    controls,
    player,
    page,
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
        if (event.key !== "Enter") return;
        searchStart(queryString, source, limit)
    }, [queryString, source, limit, searchStart])

    const clear = useCallback(()=>{
        clearSearch();
        setResultOpen(false);
    },[clearSearch, setResultOpen])

    const onInputBlur = useCallback(e => {
        if(!queryString)
            clear();
    }, [queryString, clear])


    return (
        <ErrorBoundary>
            <div className="search">
                <div className="search-controls">
                    <DropdownButton
                        id={"buttonSelectApi"}
                        className="btn-api-select"
                        title={source || ""}>
                        {apiList}
                    </DropdownButton>
                    <div className={classNames(
                        "search-control",
                            {"search-control--fail": searchStatus === "fail"}
                        )}>
                        <FormControl
                            className="search-control__input"
                            type="text"
                            placeholder={"Enter to search on " + source}
                            onChange={event => setQuery(event.target.value)}
                            onKeyPress={controlKeyPress}
                            onFocus={openList}
                            onBlur={onInputBlur}
                            value={queryString}
                            data-rtg-search-input
                        />
                        <div className={"search-control__spinner__container"}>
                            {searchStatus === "fetching" && <Spin className="search-control__spinner" />}
                        </div>
                    </div>

                    {resultOpen && queryString &&
                        <Button className="btn-search-clear" onClick={clear}> 
                            Clear 
                        </Button>}
                    <DropdownButton
                        id={"buttonSelectResultLimit"}
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
        </ErrorBoundary>
    );
}

const mapStateToProps = state => ({
    queryString: state.search.searchString,
    searchStatus: state.search.status,
})

const mapDispatchToProps = dispatch => ({
    setQuery: (text) => dispatch(searchInput(text)),
    searchStart: (text, source, limit) => dispatch(searchStart(text, source, limit)),
    clearSearch: () => dispatch(clearSearch()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Search);