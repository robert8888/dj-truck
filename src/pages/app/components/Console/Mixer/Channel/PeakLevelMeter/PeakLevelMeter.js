import React from "react"
import Console from "./../../../../../core/console/console";
import "./peak-level-meter.scss";
// there is 20 leds indicators
// 15 is blue and calc from bottom last 15 is zero dB.
// scale range is between -40 dB and + 10 dB
// this means that on led is 2.5 dB

class PeakLevelMater extends React.Component{
    constructor(...args){
        super(...args);
        this.size = 30;
    }

    state = {
        ledStates : {
            left: {
                peak : false,
                states : (new Array(this.size)).fill(false),
            },
            right: 
            {
                peak : false,
                states : (new Array(this.size)).fill(false),
            },
        },
        mixerChannelInterface : Console.Get().getMixerChannelInterface(this.props.name),
    }

    mouseOverHandler = (event) => {

    }

    componentDidMount(){
        let updateLedStates = () =>{
           let nextLedState = (new Array(this.size)).fill(false);

            let peakMeter = this.state.mixerChannelInterface.getPeakMeter();
            let ledOn = 25 + peakMeter.peakdB / 2;

            for(let i = 0 ; (i < ledOn && i < this.size); i++) {
                nextLedState[i] = true;
            }

            const channelState = {
                peak : (peakMeter.peakdB > 0),
                states : nextLedState
            }

            this.setState({
                ...this.state, 
                ledStates : {
                    left: channelState,
                    right: channelState,

                }
            })
            requestAnimationFrame(updateLedStates);
        }
        
        updateLedStates();
    }
    
    render(){
        return (
            <div className="peak-level-meter">
                <div className="meter-channel">
                    { this.state.ledStates.left.states.map((ledState, index)=>{
                        return (<div key={index} className={"level-meter-led led-"+ index + ((ledState) ? " led-on" : " led-off") }/>)
                    })}
                </div>
                <div className="meter-channel">
                    { this.state.ledStates.right.states.map((ledState, index)=>{
                        return (<div key={index} className={"level-meter-led led-"+ index + ((ledState) ? " led-on" : " led-off") }/>)
                    })}
                </div>
            </div>
        )
    }

}

export default PeakLevelMater;