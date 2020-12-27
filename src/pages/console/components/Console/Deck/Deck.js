import React, {useContext, useMemo} from "react";
import { useDrop } from 'react-dnd';
import { connect } from "react-redux";
import { loadTrack } from "actions";
import ItemTypes from "./../../../../common/DndItemTypes";
import Looper from "./Looper/Looper";
import PitchButtons from "./PitchButtons/PitchButtons";
import PitchSlider from "./PitchSlider/PitchSlider";
import PlayBackControls from "./PlayBackControls/PlayBackControls";
import Player from "./Player/Player";
import SyncControl from "./SyncControl/SyncControl";
import TrackInfo from "./TrackInfo/TrackInfo";
import ErrorBoundary from "pages/common/components/ErrorBoundary/ErrorBoundary";
import DeckContext from "./DeckCtx";
import ConsoleContext from "./../ConsoleCtx";
import classNames from "classnames";
import "./deck.scss";
import LayoutContext from "../../../../common/Layout/LayoutContext";
import BeatShiftButtons from "./SyncControl/BeatShiftButtons/BeatShiftButtons";
import MasterButtons from "./SyncControl/MasterButtons/MasterButtons";
import PitchRangeButton from "./PitchRangeButton/PitchRangeButton";


const Deck = ({name: channel, loadTrack}) => {
    const consoleContext = useContext(ConsoleContext);
    const {mode, screen} = useContext(LayoutContext);

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
            "deck--" + channel,
            "deck--" + mode,
            "deck--" + screen,
            {
                "deck--collapsed": consoleContext.collapse,
                "deck--expanded" : !consoleContext.collapse,
            })
    }, [consoleContext, channel, mode, screen])

    return (
        <ErrorBoundary>
            <DeckContext.Provider value={{channel: channel}}>
                <div className={containerClassNames} ref={drop}>
                    <TrackInfo channel={channel} mode={mode}/>
                    <div className={"deck__group"}>
                        {mode === "desktop" &&
                        <>
                            <SyncControl channel={channel} />
                            <PitchRangeButton channel={channel}/>
                        </>
                        }

                    </div>
                    <div className="player-container">
                        <Player channel={channel} mode={mode} />
                        {mode === "desktop" && <PitchSlider name={channel}/>}
                    </div>

                    {mode === "desktop" &&
                        <div className={`deck__controls deck__controls--${channel} `}>
                            <PlayBackControls name={channel} />
                            <PitchButtons name={channel} />
                            <Looper name={channel} />
                        </div>
                    }
                    {mode !== "desktop" &&
                        <BeatShiftButtons channel={channel} active={true}/>
                    }
                </div>
            {mode !== "desktop" &&
                <>
                    <div className={`deck__controls deck__controls--${channel} deck__controls--${mode}`}>
                        <PlayBackControls name={channel} />
                        <Looper name={channel} />
                    </div>
                    <MasterButtons channel={channel}/>
                </>
            }
            </DeckContext.Provider>
        </ErrorBoundary>
    )
}

const mapDispatchToProps = dispatch => ({
    loadTrack : (track, destination) => dispatch(loadTrack(track, destination))
})

export default connect(null, mapDispatchToProps)(Deck);