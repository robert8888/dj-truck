import React, { Fragment } from "react";
import { connect } from "react-redux";
import UUID from "uuidjs";
import PlaylistCtx from "./PlaylistContext";
import { ContextMenuTrigger } from "react-contextmenu"
import PlaylistTable from "./PlaylistTable/PlaylistTable";
import EmptyListInfo from "./EmptList/EmptyList";
import PlaylistItem from "./Playlist_Item/PlaylistItem";
import CtxMenu from "../../common/ContextMenu/ContextMenu";
import { loadTrack, deleteTrack, swapTrackOnList, startCalcBpm } from "./../../../../../actions";
import "./play-list.scss";



class PlayList extends React.Component {

    headers = ['#', 'Source', 'Title', 'Quality', 'Time', 'Bpm' ];

    setCurrentHover(index) {
        if (!this.menuVisible) {
            this.currentHoverElement = index;
        }
    }

    loadTrack(destination) {
        const track = this.props.playlist[this.currentHoverElement];
        this.props.load(track, destination)
    }

    deleteTrack() {
        if (this.props.playlist.length === 0) {
            return;
        }
        this.props.delete(this.currentHoverElement);
    }

    isEmpty = () => (!this.props.currentPlaylist || this.props.currentPlaylist.length === 0)

    reCalcBpm(){
        this.props.reCalcBpm(
            this.props.playlist[this.currentHoverElement],
            this.props.currentPlaylist
        )
        this.forceUpdate();
    }

    componentDidUpdate(prevProps){
        if(prevProps.refreshFalg !== this.props.refreshFalg){
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
                                            key={item._id}
                                        />
                                    )}
                                </PlaylistTable>
                                <EmptyListInfo empty={this.isEmpty()} />
                            </Fragment>
                        </PlaylistCtx.Provider>
                    </ContextMenuTrigger>
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
    delete: (index) => dispatch(deleteTrack(index)),
    swapTrack: (from, to) => dispatch(swapTrackOnList(from, to)),
    reCalcBpm: (track, playlist) => dispatch(startCalcBpm(track, playlist)),

})

export default connect(mapStateToProps, mapDispatchToProps)(PlayList);