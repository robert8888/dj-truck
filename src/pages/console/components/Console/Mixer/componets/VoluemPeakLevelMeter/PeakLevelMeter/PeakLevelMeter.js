import React from "react"
import classNames from "classnames";
import SimpleThrottle from "utils/functions/SimpleThrottle";
import "./peak-level-meter.scss";
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

        this.updateLed = SimpleThrottle.call(this, this.updateLedStates, 30)
    }

    updateLedStates() {
        let peakMeter = this.props.interface.getPeakMeter();
        let ledOn = 25 + peakMeter.peakdB / 2;
        for (let i = 0; i < this.size; i++) {
            if(!this.leftRefs[i].current || !this.rightRefs[i].current) continue;
            this.leftRefs[i].current.classList.toggle("led--on", (i <= ledOn))
            this.rightRefs[i].current.classList.toggle("led--on", (i <= ledOn))
        }
    }

    loop() {
        if (this.breakFlag) return;
        this.updateLed();
        requestAnimationFrame(() => this.loop())
    }

    start(){
        this.breakFlag = false;
        this.props.interface.startUpdating();
        this.loop();
    }

    stop(){
        this.breakFlag = true;
        if(!this.props.interface) return;
        this.props.interface.stopUpdating();
    }

    checkActive(){
        this.props.active && this.props.interface ? this.start() : this.stop();
    }

    componentDidUpdate() {
        this.checkActive();
    }

    componentDidMount(){
        this.checkActive();
    }

    componentWillUnmount() {
        this.breakFlag = true;
        if(this.props.interface) return;
        this.props.interface.stopUpdating();
    }

    render() {
        const containerClassNames = classNames(
            "peak-level-meter", {
                [`peak-level-meter--${this.props.name}`]: !!this.props.name,
                [this.props.className]: !!this.props.className,
                "peak-level-meter--horizontal" : this.props.aspect === "horizontal",
                "peak-level-meter--vertical" : this.props.aspect === "vertical"
            }
        )
        return (
            <div className={containerClassNames}>
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