import React, { useState, useEffect, useCallback } from 'react';
import { connect } from "react-redux";

import { FormControl, DropdownButton, Dropdown } from "react-bootstrap"
import SearchList from './SerachList/SearchList.js';
import { getAvailableApis, getDeafultApi } from "./../../../../apis/apiProvider";

import { searchInput, clearSearch, searchStart } from "../../../../actions";

import "./search.scss";


const Search = props => {
    const [listOpen, setListOpen] = useState(false);

    const [source, setSource] = useState(null);
    const [apiDropdownList, setApiList] = useState(null);

    const [maxResults, setMaxResults] = useState(10);

    const openList = () => setListOpen(true);

    const selectedHandel = () => {
        props.clearSearchHandler();
        setListOpen(false);
    }

    useEffect(() => {
        setApiList(getAvailableApis().map(api => {
            return (<Dropdown.Item key={api} onClick={setSource.bind(null, api)}>  {api} </Dropdown.Item>)
        }))
    }, [setApiList, setSource])

    return (
        <div className="search">
            <div className="search-controls">
                <DropdownButton 
                    className="btn-api-select"
                    title={(source) ? source : getDeafultApi()}>
                    {apiDropdownList}
                </DropdownButton>
                <FormControl
                    className="search-control"
                    type="text"
                    placeholder="Tap in to serach on youtube"
                    onChange={event => props.searchInputHandler(event.target.value)}
                    onKeyPress={event => { if (event.key === "Enter") { props.searchStartHandler(props.searchString) } }}
                    onFocus={openList}
                    value={props.searchString} />
                <DropdownButton 
                    className="btn-max-result-select"
                    title={maxResults}>
                    <Dropdown.Item> 10 </Dropdown.Item>
                    <Dropdown.Item> 25 </Dropdown.Item>
                    <Dropdown.Item> 50 </Dropdown.Item>
                </DropdownButton>


            </div>

            <SearchList
                open={listOpen}
                selectedHandle={selectedHandel} />
        </div>
    );
}

const mapStateToProps = state => ({
    searchString: state.searchReducer.searchString
})

const mapDispachToProps = dispatch => ({
    searchInputHandler: (text) => dispatch(searchInput(text)),
    searchStartHandler: (text) => dispatch(searchStart(text)),
    clearSearchHandler: () => dispatch(clearSearch()),
})

export default connect(mapStateToProps, mapDispachToProps)(Search);