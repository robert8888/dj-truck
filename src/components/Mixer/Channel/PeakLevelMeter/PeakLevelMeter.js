import React from "react"
import Console from "./../../../../core/console/console";
import "./peak-level-meter.scss";

// there is 20 leds indicators
// 15 is blue and calc from bottom last 15 is zero dB.
// scale range is between -40 dB and + 10 dB
// this means that on led is 2.5 dB

class PeakLevelMater extends React.Component{

    state = {
        ledStates : (new Array(20)).fill(false),
        mixerChannelInterface : Console.Get().getMixerChannelInterface(this.props.name),

    }

    mouseOverHandler = (event) => {

    }

    componentDidMount(){
        let updateLedStates = () =>{
           let nextLedState = (new Array(this.state.ledStates.length)).fill(false);

            let peakMeter = this.state.mixerChannelInterface.getPeakMeter();
            let ledOn = 15 + peakMeter.peakdB / 2.5;

            for(let i = 0 ; (i < ledOn && i < this.state.ledStates.length); i++) {
                nextLedState[i] = true;
            }

            this.setState({...this.state, ledStates : nextLedState})
            requestAnimationFrame(updateLedStates);
        }
        
        updateLedStates();
    }
    
    render(){
        return (
            <div className="peak-level-meter">
                { this.state.ledStates.map((ledState, index)=>{
                     return (<div key={index} className={"level-meter-led led-"+ index + ((ledState) ? " led-on" : " led-off") }/>)
                })}
            </div>
        )
    }

}

export default PeakLevelMater;