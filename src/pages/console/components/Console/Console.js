import React, { useEffect } from "react";
import { connect } from "react-redux";
import { consoleStopAll } from "./../../../../actions";
import { usePlayer } from "./../../../common/Hooks/usePlayer";
import "./console.scss";
import Deck from "./Deck/Deck";
import Effector from "./Effector/Effector";
import Mastering from "./Mixer/Master/Master";
import Mixer from "./Mixer/Mixer";
import Recorder from "./Mixer/Recorder/Recorder";

const Console = ({dispatch}) => {
    const [control] = usePlayer();
    useEffect(() =>{
        control.stop();
         return () => {
            dispatch(consoleStopAll())
        }   
    }, [control, dispatch])

    return (
        <div className="truck-console">
            <Mastering />
            <Recorder />

            <Effector channel={1} />
            <Deck name="A">A</Deck>

            <Mixer />

            <Effector channel={2} />
            <Deck name="B">B</Deck>

        </div>
    )
}


export default connect()(Console);