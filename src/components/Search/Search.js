import React, { useState } from 'react';
import { connect } from "react-redux";

import { FormControl } from "react-bootstrap"
import SearchList from './SerachList/SearchList.js';


import { searchInput, clearSearch, searchStart} from "../../actions/actions.js";

import "./search.scss";


const Search = props => {
    const [listOpen, setListOpen] = useState(false)

    const openList = () => setListOpen( true );

    const selectedHandel = () => {
        props.clearSearchHandler();
        setListOpen( false );
    }


    return (
        <div className="search">
           <FormControl className="search-control"
           type="text" 
           placeholder="Tap in to serach on youtube"
           onChange={ event => props.searchInputHandler(event.target.value) }
           onKeyPress = {event => {if(event.key == "Enter") { props.searchStartHandler(props.searchString)}} }
           onFocus={ openList }
           value={ props.searchString }
           />
           <SearchList 
           open={ listOpen }
           selectedHandle={ selectedHandel }/>
        </div>
    );
}

const mapStateToProps = state => ({
    searchString : state.searchReducer.searchString
})

const mapDispachToProps =  dispatch => ({
    searchInputHandler : (text) => dispatch(searchInput(text)),
    searchStartHandler : (text) => dispatch(searchStart(text)),
    clearSearchHandler : () => dispatch(clearSearch()),
})

export default connect(mapStateToProps, mapDispachToProps)(Search);