import { ACTIONS } from "../../../actions";
import React from "react";
import { connect } from "react-redux";
import { stripHtml } from "./../../../utils/html/htmlHelper";
import getApi from "./../../../apis/apiProvider";
//----
import "./search-list.scss";


const SearchListItem = ( props ) => {

    const {title, description, id, thumbnails, duration, source} = props.item;

    const api = getApi(source);

    const sourceUrl = api.getUrlToExternall(id);

    const formatTime = time => (time && time.substr(2, time.length).toLowerCase());

    const handleClick = () => {
        props.addToListHandle(props.item);
        props.closeListHandle();
    }


    return(
        <li className="search-list-item" onClick={handleClick}>
            <div className="list-item-thumbnails">
                <img alt="youtube thumbnail" className="thumbnail-img" src={ thumbnails?.default?.url } />
                <span className="thumbnail-time">{ formatTime(duration) }</span>
            </div>
            <div className="list-item-details">
                <h5>{ stripHtml(title) }</h5>
                <p>{ stripHtml(description) }</p>
                <a href={ sourceUrl }> { sourceUrl } </a>
            </div>
        </li>
    )
}

class SearchList extends React.Component{
    constructor(){
        super();
        this.state = {
            open : true,
        }
    }


    render(){
        return (
            (this.props.open && <div className="search-results">
                { this.props.searchList[0]?.error &&
                    <div> Connect to youtube problem: <pre>{JSON.stringify(this.props.searchList[0]?.error.errors)}</pre></div>
                }
                <ul className="search-result-list">
                    { 
                    ( this.props.searchList && !this.props.searchList[0]?.error && this.props.searchList.map( item => 
                        <SearchListItem 
                        item={ item } 
                        addToListHandle={ this.props.addToListHandle } 
                        closeListHandle={ this.props.selectedHandle }
                        key={ item.id }/> 
                    )) 
                    }
                </ul>
            </div>)
        );
    }
};

const mapStateToProps = state => {
    return {
        searchList : state.searchReducer.searchResults,
    }
}

const mapDispachToProps = dispach => {
    return {
        addToListHandle : (track) =>  dispach({ type: ACTIONS.PUSH_TRACK , track : track})
    }
}

export default connect(mapStateToProps, mapDispachToProps)(SearchList);