import React from "react"
import Console from "./../../../../../core/console/console";
import "./peak-level-meter.scss";
// there is 20 leds indicators
// 15 is blue and calc from bottom last 15 is zero dB.
// scale range is between -40 dB and + 10 dB
// this means that on led is 2.5 dB

class PeakLevelMater extends React.PureComponent {
    constructor(...args) {
        super(...args);
        this.size = 30;


        this.rightChannel = [];
        this.leftChannel = [];

        this.leftRefs = new Array(this.size);
        this.rightRefs = new Array(this.size);

        for (let i = 0; i < this.size; i++) {
            this.leftRefs[i] = React.createRef();
            this.rightRefs[i] = React.createRef();

            this.rightChannel.push(
                <div
                    ref={this.rightRefs[i]}
                    key={'right-' + i}
                    className={"level-meter-led right-bar led-" + i} />
            )
            this.leftChannel.push(
                <div
                    ref={this.leftRefs[i]}
                    key={'left-' + i}
                    className={"level-meter-led left-bar led-" + i} />
            )
        }

        this.mixerChannelInterface =  Console.Get().getMixerChannelInterface(this.props.name);
        this.breakFlag = false;
    }

    componentDidMount() {
        let lastCall = null;
        const updateLedStates = () => {

            requestAnimationFrame(updateLedStates);
            //throtell to 50ms
            const now = new Date().getTime();
            if(now - lastCall < 50){
                return;
            }
            lastCall = now; 

            if(this.breakFlag){
                return;
            }

            //drawing ...
            let peakMeter = this.mixerChannelInterface.getPeakMeter();
            let ledOn = 25 + peakMeter.peakdB / 2;

            for (let i = 0; i < this.size; i++) {

                this.leftRefs[i].current.classList.toggle("led--on", (i <= ledOn))
                this.rightRefs[i].current.classList.toggle("led--on", (i <= ledOn))
            }
        }

        updateLedStates();
    }

    componentWillUnmount(){
        this.breakFlag = true;   
    }

    render() {

        return (
            <div className="peak-level-meter">
                <div className="meter-channel">
                    {this.leftChannel}
                </div>
                <div className="meter-channel">
                    {this.rightChannel}          
                </div>
            </div>
        )
    }

}

export default PeakLevelMater;