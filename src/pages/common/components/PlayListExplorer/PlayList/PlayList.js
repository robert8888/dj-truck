import React, { Fragment } from "react";
import { connect } from "react-redux";
import PlaylistCtx from "./PlaylistContext";
import { ContextMenuTrigger } from "react-contextmenu"
import PlaylistTable from "./PlaylistTable/PlaylistTable";
import EmptyListInfo from "./EmptList/EmptyList";
import PlaylistItem from "./Playlist_Item/PlaylistItem";
import CtxMenu from "../../../../common/components/ContextMenu/ContextMenu";
import {
    loadTrack,
    deleteTrackRequest,
    swapTrackOnList,
    startCalcBpm,
    resetCurrentPlaylistContent,
    updateTrackPositionRequest,
} from "./../../../../../actions";
import "./play-list.scss";



class PlayList extends React.Component {
    currentHoverElement = -1;
    playlistSnapshot = null;

    headers = ['#', 'Source', 'Title', 'Quality', 'Time', 'Bpm'];

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


    makeListSnapshot() {
        this.playlistSnapshot = this.props.playlist;
    }

    resetList() {
        this.props.resetList(this.playlistSnapshot);
    }

    acceptListOrder() {
        const prev = this.playlistSnapshot;
        const current = this.props.playlist;
        //find difretces and call to api
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
        if (prevProps.refreshFalg !== this.props.refreshFalg) {
            this.forceUpdate();
        }
    }

    render() {
        return (
            <Fragment>
                <div className="playlist">
                    <ContextMenuTrigger id="playlist_ctx_menu" className="playlist" holdToDisplay={-1}>
                        <PlaylistCtx.Provider value={{ setHover: this.setCurrentHover.bind(this) }}>
                            <Fragment>
                                <PlaylistTable headers={this.headers}>
                                    {this.props.playlist && this.props.playlist.map((item, index) =>
                                        <PlaylistItem
                                            item={item}
                                            listIndex={index}
                                            swapItems={this.props.swapTrack}
                                            dragStart={this.makeListSnapshot.bind(this)}
                                            endOutside={this.resetList.bind(this)}
                                            endWithin={this.acceptListOrder.bind(this)}
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
                    items={{
                        "Send to A": this.loadTrack.bind(this, "A"),
                        "Send to B": this.loadTrack.bind(this, "B"),
                        "Calc BPM": this.reCalcBpm.bind(this),
                        "Delete": this.deleteTrack.bind(this)
                    }}
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
    refreshFalg: state.playList.refreshFalg,
})

const mapDispatchToProps = dispatch => ({
    load: (track, destination) => dispatch(loadTrack(track, destination)),
    delete: (index, id) => dispatch(deleteTrackRequest(index, id)),
    swapTrack: (from, to) => dispatch(swapTrackOnList(from, to)),
    reCalcBpm: (track, playlist) => dispatch(startCalcBpm(track, playlist)),
    resetList: (list) => dispatch(resetCurrentPlaylistContent(list)),
    updateTracksPositions : (tracksPositions) => dispatch(updateTrackPositionRequest(tracksPositions))
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayList);