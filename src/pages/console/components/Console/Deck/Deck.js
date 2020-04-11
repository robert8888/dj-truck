import React from "react";
import {connect} from "react-redux";
import "./deck.scss";
import Player from "./Player/Player";
import TrackInfo from "./TrackInfo/TrackInfo";
import SyncControl from "./SyncControl/SyncControl";
import PlayBackControls from "./PlayBackControls/PlayBackControls";
import PitchSlider from "./PitchSlider/PitchSlider";
import PitchButtons from "./PitchButtons/PitchButtons";
import Looper from "./Looper/Looper";
import { useDrop } from 'react-dnd'
import ItemTypes from "./../../../appItemTypes";
import { loadTrack } from "./../../../../../actions";

const Deck = props => {


    const dropResult = (item) => {
        props.loadTrack(item.track, props.name);
        return {
            target: "deck"
        }
    }

    const [ _ , drop] = useDrop({
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