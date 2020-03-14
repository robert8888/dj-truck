import React from "react";
import "./deck.scss";

import getApi from "./../../apis/apiProvider";

import Player from "./Player/Player";
import TrackInfo from "./TrackInfo/TrackInfo";
import SyncControl from "./SyncControl/SyncControl";
import PlayBackControls from "./PlayBackControls/PlayBackControls";
import PitchSlider from "./PitchSlider/PitchSlider";
import PitchButtons from "./PitchButtons/PitchButtons";
import Looper from "./Looper/Looper";

class Deck extends React.Component {

    render() {
        return (
            <div className={ "deck deck-" + this.props.name } >
                <TrackInfo name={ this.props.name }/>
                <SyncControl name={ this.props.name }/>
                <div className="flex-container">
                    <Player name={ this.props.name }/> 
                    <PitchSlider  name={ this.props.name }/>
                </div>
                <div className="control-area">
                    <PlayBackControls name={ this.props.name }/>
                    <PitchButtons name={this.props.name}/>
                    <Looper name={this.props.name}/>
                </div>
            </div>
            )
        }
}

export default Deck;