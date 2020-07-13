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
        this.breakFlag = false;
        this.lastCall = 0;
    }

    updateLedStates() {
        let peakMeter = this.props.interface.getPeakMeter();
        let ledOn = 25 + peakMeter.peakdB / 2;

        for (let i = 0; i < this.size; i++) {
            if(!this.leftRefs[i] || this.rightRefs[i]) break;
            this.leftRefs[i].current.classList.toggle("led--on", (i <= ledOn))
            this.rightRefs[i].current.classList.toggle("led--on", (i <= ledOn))
        }
    }

    checkActive(){
        if(this.props.active && this.props.interface){
            this.breakFlag = false;
            this.props.interface.startUpdating();
            this.intervalHandle = setInterval(() => requestAnimationFrame(this.updateLedStates.bind(this)), 40);
        } else {
            this.breakFlag = true;
            if(!this.props.interface) return;
            clearInterval(this.intervalHandle);
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