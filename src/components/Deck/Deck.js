import React from "react";
import { connect } from "react-redux";
import "./deck.scss";

import getApi from "./../../apis/apiProvider";

import Player from "./Player/Player";
import TrackInfo from "./TrackInfo/TrackInfo";
import PlayBackControls from "./PlayBackControls/PlayBackControls";
import PitchSlider from "./PitchSlider/PitchSlider";
import PitchButtons from "./PitchButtons/PitchButtons";


class Deck extends React.Component {

    render() {
        let api = getApi(this.props.track.source);
        let url = (api && api.getUrl(this.props.track.id)) || null;

        return (
            <div className={ "deck deck-" + this.props.name } >
                <TrackInfo name={ this.props.name } />
                <div className="flex-container">
                    <Player name={ this.props.name } url={url} />
                    <PitchSlider  name={ this.props.name } />
                </div>
                <PlayBackControls name={ this.props.name } />
                <PitchButtons name={this.props.name}/>
            </div>
            )
        }
}

const mapStateToProps = (state, ownProps) => ({
    track : state.console.channel[ownProps.name].track,
})

export default connect(mapStateToProps)(Deck);