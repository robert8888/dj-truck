import React, {useEffect} from "react";
import { connect } from "react-redux";
import { consoleStopAll} from "./../../../../actions";
import Deck from "./Deck/Deck";
import Mixer from "./Mixer/Mixer";
import "./console.scss";
import Mastering from "./Mixer/Master/Master";
import Effector from "./Effector/Effector";
import Recorder from "./Mixer/Recorder/Recorder";
import {useRecordPlayer} from "./../../../common/Hooks/useRecordPlayer";

const Console = ({dispatch}) => {
    const [control] = useRecordPlayer();
    useEffect(() =>{
        control.stop();
         return () => {
            dispatch(consoleStopAll())
        }   
    }, [control, dispatch, consoleStopAll])

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