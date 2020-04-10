import React from "react";
import Channel from "./Channel/Channel";
import Fader from "./Fader/Fader";
import "./mixer.scss"

class Mixer extends React.Component{

    render(){
        return (
            <div className="mixer">
                <Channel name="A"/>
                <Channel name="B"/>
                <Fader className="mixer-fader"/>
            </div>
        )
    }
}


export default Mixer;