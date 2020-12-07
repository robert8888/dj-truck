import React from "react";
import Channel from "./Channel/Channel";
import Fader from "./Fader/Fader";
import ErrorBoundary from "pages/common/components/ErrorBoundary/ErrorBoundary";
import ConsoleCtx from "./../ConsoleCtx";
import "./mixer.scss"

class Mixer extends React.Component{
    static contextType = ConsoleCtx;
    render(){
        return (
            <ErrorBoundary>
                    <div className={"mixer mixer--" + (this.context.collapse ? "collapsed" : "expanded")}>
                        <Channel name="A"/>
                        <Channel name="B"/>
                        <Fader />
                    </div>
            </ErrorBoundary>
        )
    }
}



export default Mixer;