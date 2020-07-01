import React from "react"

import "./peak-level-meter--vertical.scss";
// there is 30 leds indicators
// 25 is blue and calc from bottom last 25 is zero dB.

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

       // this.mixerChannelInterface = this.props.interface; 
        this.breakFlag = false;
        this.lastCall = 0;

    }

    updateLedStates() {
        if (this.breakFlag) {
            return;
        }

        requestAnimationFrame(this.updateLedStates.bind(this));
        //throtell to 50ms
        const now = new Date().getTime();
        if (now - this.lastCall < 30) {
            return;
        }
        this.lastCall = now;

        //drawing ...
        let peakMeter = this.props.interface.getPeakMeter();
        let ledOn = 25 + peakMeter.peakdB / 2;


        for (let i = 0; i < this.size; i++) {

            this.leftRefs[i].current.classList.toggle("led--on", (i <= ledOn))
            this.rightRefs[i].current.classList.toggle("led--on", (i <= ledOn))
        }
    }

    checkActive(){
        if(this.props.active && this.props.interface){
            this.breakFlag = false;
            this.props.interface.startUpdating();
            setTimeout(this.updateLedStates.bind(this), 100);
        } else {
            this.breakFlag = true;
            if(!this.props.interface) return;
            this.props.interface.stopUpdating();
        }
    }

    componentDidUpdate() {
        this.checkActive();
    }

    componentDidMount(){
        this.checkActive();
    }


    componentWillUnmount() {
        this.breakFlag = true;
        this.props.interface.stopUpdating();
    }

    render() {

        return (
            <div className={"peak-level-meter " + this.props.className}>
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