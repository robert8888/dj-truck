import React from "react"
import EqKnob from "./EqKnob/EqKnob"
import GainKnob from "./GainKnob/GainKnob";

import "./mixer-channel.scss";

class Channel extends React.Component{

    render(){
        return (
            <div className={"mixer-channel channel-" + this.props.name }>
                <GainKnob className="eq-mid" onChange={ value => console.log(value)}/>
                <EqKnob band="mid" className="eq-hi" onChange={ value => console.log(value)}/>
                <EqKnob band="mid" className="eq-mid" onChange={ value => console.log(value)}/>
                <EqKnob band="low" className="eq-low" onChange={ value => console.log(value)}/>
            </div>
        )
    }

}


export default Channel;