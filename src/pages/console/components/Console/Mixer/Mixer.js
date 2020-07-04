import React from "react";
import Channel from "./Channel/Channel";
import Fader from "./Fader/Fader";
import "./mixer.scss"
import ErrorBoundary from "../../../../common/components/ErrorBoundary/ErrorBoundary";
import {MAPPING} from "../../../../../actions";

class Mixer extends React.Component{

    render(){
        return (
            <ErrorBoundary>
                <div className="mixer">
                    <Channel name="A"/>
                    <Channel name="B"/>
                    <Fader
                        className="mixer-fader"
                        role={MAPPING.MIXER_FADER}/>
                </div>
            </ErrorBoundary>
        )
    }
}


export default Mixer;