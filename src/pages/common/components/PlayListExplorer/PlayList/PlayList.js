import React, { Fragment } from "react";
import { ContextMenuTrigger } from "react-contextmenu";
import { connect } from "react-redux";
import CtxMenu from "../../../../common/components/ContextMenu/ContextMenu";
import {
    deleteTrackRequest,
    loadTrack,
    resetCurrentPlaylistContent,
    startCalcBpm,
    swapTrackOnList,
    updateTrackPositionRequest,
    startSearchBpm, preFetchPlaylistContent
} from "../../../../../actions";
import EmptyListInfo from "./EmptList/EmptyList";
import "./play-list.scss";
import PlaylistCtx from "./PlaylistContext";
import PlaylistTable from "./PlaylistTable/PlaylistTable";
import PlaylistItem from "./Playlist_Item/PlaylistItem";
import {getApi} from "../../../../../apis/apiProvider";



class PlayList extends React.Component {
    constructor(...args){
        super(...args);
        this.currentHoverElement = -1;
        this.playlistSnapshot = null;
    
        this.headers = ['#', 'Source', 'Title', 'Quality', 'Time', 'Bpm'];
       
        if(this.props.player){
            this.headers.unshift("");
        } else {
            this.headers.push("Destination")
        }
    }

    setCurrentHover(index) {
        if (!this.menuVisible) {
            this.currentHoverElement = index;
        }
    }

    loadTrack(destination) {
        if (this.currentHoverElement === -1) return;

        const track = this.props.playlist[this.currentHoverElement];
        this.props.load(track, destination)
    }

    cacheTrack(){
        if(this.currentHoverElement === -1) return;

        const track = this.props.playlist[this.currentHoverElement];
        const url = getApi(track.source).getUrl(track.sourceId);
        this.props.cache(this.props.currentPlaylist, [{
            id: track.id,
            url
        }])
    }

    deleteTrack() {
        if (this.props.playlist.length === 0 || this.currentHoverElement === -1) {
            return;
        }
        const id = this.props.playlist[this.currentHoverElement].id;
        this.props.delete(this.currentHoverElement, id);
    }

    isEmpty = () => (!this.props.currentPlaylist || this.props.currentPlaylist.length === 0)

    reCalcBpm() {
        if (this.currentHoverElement === -1) return;

        this.props.reCalcBpm(
            this.props.playlist[this.currentHoverElement],
            this.props.currentPlaylist
        )
        this.forceUpdate();
    }

    searchBpm(){
        if (this.currentHoverElement === -1) return;

        this.props.startSearchBpm(
            this.props.playlist[this.currentHoverElement],
            this.props.currentPlaylist
        )
    }


    makeListSnapshot() {
        this.playlistSnapshot = this.props.playlist;
    }

    resetList() {
        this.props.resetList(this.playlistSnapshot);
    }

    acceptListOrder() {
        const prev = this.playlistSnapshot;
        const current = this.props.playlist;
        //find differences in tracks order and call to api
        const tracksPositionsMap = [];
        current.forEach((_, index) => {
            if (prev[index].id !== current[index].id) {
                tracksPositionsMap.push({
                    id: current[index].id,
                    position: index,
                })
            }
        })
        this.props.updateTracksPositions(tracksPositionsMap);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.refreshFlag !== this.props.refreshFlag) {
            this.forceUpdate();
        }
    }

    getContextMenuItems(){
        let items =  {
            "Calc BPM": this.reCalcBpm.bind(this),
            "Get Bpm": this.searchBpm.bind(this),
            "Delete": this.deleteTrack.bind(this),
            "Cache": this.cacheTrack.bind(this),
        }
        if(this.props.page === "console"){
            items = {
                ...items,
                "Send to A": this.loadTrack.bind(this, "A"),
                "Send to B": this.loadTrack.bind(this, "B"),
            }
        }
        return items;
    }


    render() {
        return (
            <Fragment>
                <div className="playlist">
                    <ContextMenuTrigger id="playlist_ctx_menu" className="playlist" holdToDisplay={-1}>
                        <PlaylistCtx.Provider value={{
                            setHover: this.setCurrentHover.bind(this),
                        }}>
                            <Fragment>
                                <PlaylistTable headers={this.headers}>
                                    {this.props.playlist && this.props.playlist.map((item, index) =>
                                        <PlaylistItem
                                            player={this.props.player}
                                            controls={this.props.controls}
                                            item={item}
                                            listIndex={index}
                                            swapItems={this.props.swapTrack}
                                            dragStart={this.makeListSnapshot.bind(this)}
                                            endOutside={this.resetList.bind(this)}
                                            endWithin={this.acceptListOrder.bind(this)}
                                            withSends={this.props.page === "console"}
                                            channelPaused={{
                                                A: this.props.channelPausedA,
                                                B: this.props.channelPausedB,
                                            }}
                                            load={this.props.load}
                                            key={item.id}
                                        />
                                    )}
                                </PlaylistTable>
                            </Fragment>
                        </PlaylistCtx.Provider>
                    </ContextMenuTrigger>
                    <EmptyListInfo empty={this.isEmpty()} />
                </div>
                <CtxMenu
                    id="playlist_ctx_menu"
                    items={this.getContextMenuItems()}
                    handlers={{
                        onShow: () => this.menuVisible = true,
                        onHide: () => this.menuVisible = false,
                    }}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    playlist: state.playList.list,
    currentPlaylist: state.playList.currentPlaylist,
    refreshFlag: state.playList.refreshFalg,
    channelPausedA: state.console.channel.A.playBackState.paused,
    channelPausedB: state.console.channel.B.playBackState.paused,
})

const mapDispatchToProps = dispatch => ({
    load: (track, destination) => dispatch(loadTrack(track, destination)),
    delete: (index, id) => dispatch(deleteTrackRequest(index, id)),
    cache: (playlist, tracks) => dispatch(preFetchPlaylistContent(playlist, tracks)),
    swapTrack: (from, to) => dispatch(swapTrackOnList(from, to)),
    reCalcBpm: (track, playlist) => dispatch(startCalcBpm(track, playlist)),
    startSearchBpm: (track, playlist) => dispatch(startSearchBpm(track, playlist)),
    resetList: (list) => dispatch(resetCurrentPlaylistContent(list)),
    updateTracksPositions : (tracksPositions) => dispatch(updateTrackPositionRequest(tracksPositions))
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayList);