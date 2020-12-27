import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
    deleteTrackRequest,
    loadTrack,
    resetCurrentPlaylistContent,
    startCalcBpm,
    swapTrackOnList,
    updateTrackPositionRequest,
    startSearchBpm, preFetchPlaylistContent, setBpmOrOffsetDeck
} from "actions";
import {
    Menu,
    Item,
    Separator,
} from "react-contexify";
import EmptyListInfo from "./EmptList/EmptyList";
import PlaylistCtx from "./PlaylistContext";
import PlaylistTable from "./PlaylistTable/PlaylistTable";
import PlaylistItem from "./Playlist_Item/PlaylistItem";
import {getApi} from "apis/apiProvider";
import ContextMenuProvider from "pages/common/components/ContextMenu/ContextMenuProvider"
import "./play-list.scss";
import InputModal from "../../InputModal/InputModal";


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

        this.state = {
            currentHoveredTrack : null,
        }
    }

    setCurrentHover(index) {
        if (!this.menuVisible) {
            this.currentHoverElement = index;
        }
    }

    updateCurrentHoveredTrack(){
        this.setState(state => ({
            ...state,
            currentHoveredTrack: this.props.playlist[this.currentHoverElement]
        }))
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

    setBpm(bpm){
        if (this.currentHoverElement === -1) return;

        const trackId = this.props.playlist[this.currentHoverElement]?.id;
        const trackOffset = this.props.playlist[this.currentHoverElement]?.offset;

        if(trackId === undefined || trackId === null)
            return;

        this.props.setBpm(trackId, bpm, trackOffset);
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

    render() {
        return (
            <Fragment>
                <div className="playlist">
                    <ContextMenuProvider id="PLAYLIST">
                        <PlaylistCtx.Provider value={{setHover: this.setCurrentHover.bind(this)}}>
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
                    </ContextMenuProvider>
                    <EmptyListInfo empty={this.isEmpty()} />
                </div>
                <Menu id={"PLAYLIST"} className={"context-menu context-menu--playlist"}>
                    <Item onClick={this.reCalcBpm.bind(this)}> Calc BPM </Item>
                    <Item onClick={this.searchBpm.bind(this)}> Get BPM </Item>
                    <Item onClick={() =>{
                        this.openModal(true)
                        this.updateCurrentHoveredTrack()
                    }}>
                        Set BPM
                    </Item>
                    <Item onClick={this.deleteTrack.bind(this)}> Delete </Item>
                    <Item onClick={this.cacheTrack.bind(this)}> Cache </Item>
                    {this.props.page === "console" &&
                        <>
                        <Separator />
                        <Item onClick={this.loadTrack.bind(this, "A")}>
                            <span className="context-menu__item context-menu__item--deck-A" data-deck="A">Send to </span>
                        </Item>
                        <Item onClick={this.loadTrack.bind(this, "B")}>
                            <span className="context-menu__item context-menu__item--deck-B" data-deck="B">Send to </span>
                        </Item>
                        </>
                    }
                </Menu>
                <InputModal
                    openRef={ref => this.openModal = ref}
                    title={"Set Bpm"}
                    onConfirm={this.setBpm.bind(this)}
                    textContent={this.state.currentHoveredTrack?.title}
                    buttonText={"Update BPM"}
                    initValue={this.state.currentHoveredTrack?.bpm}
                    inputProps={{min: 60, max: 300, step: .01}}
                    inputType="number"/>
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
    setBpm: (trackId, bpm, offset) => dispatch(setBpmOrOffsetDeck(null, bpm, offset, trackId)),
    startSearchBpm: (track, playlist) => dispatch(startSearchBpm(track, playlist)),
    resetList: (list) => dispatch(resetCurrentPlaylistContent(list)),
    updateTracksPositions : (tracksPositions) => dispatch(updateTrackPositionRequest(tracksPositions))
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayList);