import React from "react";
import { useDrop } from 'react-dnd';
import { connect } from "react-redux";
import { loadTrack } from "./../../../../../actions";
import ItemTypes from "./../../../../common/DndItemTypes";
import "./deck.scss";
import Looper from "./Looper/Looper";
import PitchButtons from "./PitchButtons/PitchButtons";
import PitchSlider from "./PitchSlider/PitchSlider";
import PlayBackControls from "./PlayBackControls/PlayBackControls";
import Player from "./Player/Player";
import SyncControl from "./SyncControl/SyncControl";
import TrackInfo from "./TrackInfo/TrackInfo";

const Deck = props => {

    const dropResult = (item) => {
        props.loadTrack(item.track, props.name);
        return {
            target: "deck"
        }
    }

    const [ , drop] = useDrop({
        accept : ItemTypes.TRACK,
        drop: dropResult,
    })

    return (
        <div className={"deck deck-" + props.name} ref={drop}>
            <TrackInfo name={props.name} />
            <SyncControl name={props.name} />
            <div className="player-container">
                <Player name={props.name} />
                <PitchSlider name={props.name} />
            </div>
            <div className="control-area">
                <PlayBackControls name={props.name} />
                <PitchButtons name={props.name} />
                <Looper name={props.name} />
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    loadTrack : (track, destination) => dispatch(loadTrack(track, destination))
})

export default connect(null, mapDispatchToProps)(Deck);