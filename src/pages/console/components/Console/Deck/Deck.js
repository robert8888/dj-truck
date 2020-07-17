import React, {useContext, useMemo} from "react";
import { useDrop } from 'react-dnd';
import { connect } from "react-redux";
import { loadTrack } from "./../../../../../actions";
import ItemTypes from "./../../../../common/DndItemTypes";
import Looper from "./Looper/Looper";
import PitchButtons from "./PitchButtons/PitchButtons";
//import PitchInKeyButton from "./InKeyButton/PitchInKeyButton";
import PitchSlider from "./PitchSlider/PitchSlider";
import PlayBackControls from "./PlayBackControls/PlayBackControls";
import Player from "./Player/Player";
import SyncControl from "./SyncControl/SyncControl";
import TrackInfo from "./TrackInfo/TrackInfo";
import ErrorBoundary from "../../../../common/components/ErrorBoundary/ErrorBoundary";
import DeckContext from "./DeckCtx";
import ConsoleContext from "./../ConsoleCtx";
import classNames from "classnames";
import "./deck.scss";


const Deck = ({name: channel, loadTrack}) => {
    const consoleContext = useContext(ConsoleContext);
    const dropResult = (item) => {
        loadTrack(item.track, channel);
        return {
            target: "deck"
        }
    }

    const [ , drop] = useDrop({
        accept : ItemTypes.TRACK,
        drop: dropResult,
    })


    const containerClassNames = useMemo(()=>{
        return classNames(
            "deck",
            "deck--" + channel, {
                "deck--collapsed": consoleContext.collapse,
                "deck--expanded" : !consoleContext.collapse,
            })
    }, [consoleContext])

    return (
        <ErrorBoundary>
            <DeckContext.Provider value={{channel: channel}}>
                <div className={containerClassNames} ref={drop}>
                    <TrackInfo name={channel} />
                    <div className={"deck__group"}>
                        <SyncControl channel={channel} />
                        {/*<PitchInKeyButton/>*/}
                    </div>
                    <div className="player-container">
                        <Player name={channel} />
                        <PitchSlider name={channel}/>
                    </div>
                    <div className="controls">
                        <PlayBackControls name={channel} />
                        <PitchButtons name={channel} />
                        <Looper name={channel} />
                    </div>
                </div>
            </DeckContext.Provider>
        </ErrorBoundary>
    )
}

const mapDispatchToProps = dispatch => ({
    loadTrack : (track, destination) => dispatch(loadTrack(track, destination))
})

export default connect(null, mapDispatchToProps)(Deck);