import React from "react";
import Channel from "./Channel/Channel";
import "./mixer.scss"

class Mixer extends React.Component{

    render(){
        return (
            <div className="mixer">
                <Channel name="A"/>
                <Channel name="B"/>
            </div>
        )
    }
}


export default Mixer;