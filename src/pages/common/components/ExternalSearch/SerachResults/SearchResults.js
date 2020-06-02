import React from "react";
import { connect } from "react-redux";
import { pushTrackToListRequest } from "../../../../../actions";
import "./search-results.scss";
import SearchItem from "./SearchItem/SearchItem";

class SearchResults extends React.Component {
    constructor() {
        super();
        this.state = {
            open: true,
        }
    }

    render() {
        if(!this.props.searchList){
            return null;
        }

        return (
            (this.props.open && <div className="search-results">
                { (!this.props.searchList || this.props?.searchList[0]?.error) &&
                    <div> Connect to youtube problem: <pre>{JSON.stringify(this.props.searchList[0]?.error.errors)}</pre></div>
                }
                <ul className="search-result-list">
                    {
                        (this.props.searchList && !this.props?.searchList[0]?.error && this.props?.searchList.map(item =>
                            <SearchItem
                                item={item}
                                playback={this.props.playback}
                                player={this.props.player}
                                addToListHandle={
                                    this.props.addToListHandle.bind(null, [...this.props.currentPlaylist])
                                }
                                closeListHandle={this.props.selectedHandle}
                                key={item.sourceId} />
                        ))
                    }
                </ul>
            </div>)
        );
    }
};

const mapStateToProps = state => {
    return {
        searchList: state.searchReducer.searchResults,
        currentPlaylist: state.playList.currentPlaylist,
    }
}

const mapDispachToProps = dispach => {
    return {
        addToListHandle: (playlist, track) => dispach(pushTrackToListRequest(track, playlist))
        
    }
}

export default connect(mapStateToProps, mapDispachToProps)(SearchResults);