import React from "react";
import Channel from "./Channel/Channel";
import Fader from "./Fader/Fader";
import "./mixer.scss"
import ErrorBoundary from "../../../../common/components/ErrorBoundary/ErrorBoundary";

class Mixer extends React.Component{

    render(){
        return (
            <ErrorBoundary>
                <div className="mixer">
                    <Channel name="A"/>
                    <Channel name="B"/>
                    <Fader className="mixer-fader"/>
                </div>
            </ErrorBoundary>
        )
    }
}


export default Mixer;