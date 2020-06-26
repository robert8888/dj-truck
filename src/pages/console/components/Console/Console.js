import React, { useEffect } from "react";
import { connect } from "react-redux";
import { consoleStopAll, setFooterType } from "./../../../../actions";
import { usePlayer } from "./../../../common/Hooks/usePlayer";
import "./console.scss";
import Deck from "./Deck/Deck";
import Effector from "./Effector/Effector";
import Mastering from "./Mixer/Master/Master";
import Mixer from "./Mixer/Mixer";
import Recorder from "./Mixer/Recorder/Recorder";
import ErrorBoundary from "./../../../common/components/ErrorBoundary/ErrorBoundary";

const Console = ({dispatch}) => {
    const [control] = usePlayer();
    useEffect(() =>{
        control.stop();
         return () => {
            dispatch(consoleStopAll())
        }   
    }, [control, dispatch])

    useEffect(()=>{
        dispatch(setFooterType("default"))
    }, [dispatch])

    return (
        <ErrorBoundary>
            <div className="truck-console">
                <Mastering />
                <Recorder />

                <Effector channel={1} />
                <Deck name="A">A</Deck>

                <Mixer />

                <Effector channel={2} />
                <Deck name="B">B</Deck>
            </div>
        </ErrorBoundary>
    )
}


export default connect()(Console);