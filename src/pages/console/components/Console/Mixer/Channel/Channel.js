import React from "react";
import {connect} from "react-redux";
import Console from "./../../../../core/console/console";
import EqKnob from "./../componets/EqKnob/EqKnob"
import GainKnob from "./../componets/GainKnob/GainKnob";
import FilterKnob from "./../componets/FilterKnob/FitlerKnob";
import ResonanceKnob from "./../componets/ResonasKnob/ResonansKnob";
import BinaryButton from "./../../../../../common/components/BinnaryButton/BinnaryButton";
import VolumePeakLevelMeter from "../componets/VoluemPeakLevelMeter/VolumePeakLevelMeter";
import {
    setGain,
    setVolume,
    setLow,
    setMid,
    setHi,
    setSend,
    setFilter,
    setFilterResonans,
    setCue,
    MAPPING,
} from "./../../../../../../actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeadphones} from "@fortawesome/free-solid-svg-icons"
import "./mixer-channel.scss";
import ConsoleContext from "./../../ConsoleCtx";
import classNames from "classnames";

class Channel extends React.Component {
    cueNotSupportedMsg = `Sorry your device not support cue`;
    state = {
        console: null
    }

    static contextType = ConsoleContext

    componentDidMount() {
        Console.Get().then(instance => this.setState({
            ...this.state,
            console: instance,
        }))
    }

    containerClassNames(){
        return classNames(
            "mixer-channel",
            "channel-" + this.props.name,{
                "channel--collapsed": this.context.collapse,
                "channel--expanded": !this.context.collapse,
            }
        )
    }

    render() {
        const channel = this.props.name;
        return (
            <div className={this.containerClassNames()}>
                <div className="knobs-set-1">
                    <EqKnob text="Hi"
                            className="eq-hi"
                            get={state => state.mixer.channels[channel].high.current}
                            set={value => setHi(channel, value)}
                            role={MAPPING[`MIXER_CHANNEL_${channel}_EQ_HI`]}/>
                    <EqKnob text="Mid"
                            className="eq-mid"
                            get={state => state.mixer.channels[channel].mid.current}
                            set={value => setMid(channel, value)}
                            role={MAPPING[`MIXER_CHANNEL_${channel}_EQ_MID`]}/>
                    <EqKnob text="Low"
                            className="eq-low"
                            get={state => state.mixer.channels[channel].low.current}
                            set={value => setLow(channel, value)}
                            role={MAPPING[`MIXER_CHANNEL_${channel}_EQ_LOW`]}/>

                </div>

                <VolumePeakLevelMeter
                    aspect={"vertical"}
                    className={"volume-plm peak-level-meter"}
                    name={channel}
                    active={this.props.chReady}
                    get={state => state.mixer.channels[channel].volume.current}
                    set={value => setVolume(channel, value)}
                    updateFlag={this.context.collapse}
                    role={MAPPING[`MIXER_CHANNEL_${channel}_VOLUME`]}
                    interface={this.state.console && this.state.console.getMixerChannelInterface(channel)}/>

                <div className="knobs-set-2">
                    <GainKnob
                        className="eq-gain"
                        get={state => state.mixer.channels[channel].gain.current}
                        set={ value => setGain(channel, value)}
                        role={MAPPING[`MIXER_CHANNEL_${channel}_GAIN`]}/>
                    <div className="mixer-group">
                        <ResonanceKnob
                            text="RES"
                            className="resonans"
                            get={state => state.mixer.channels[channel].filterResonance.current}
                            set={value => setFilterResonans(channel, value)}
                            role={MAPPING[`MIXER_CHANNEL_${channel}_FILTER_RESONANCE`]}/>
                        <FilterKnob
                            text="FL"
                            className="filter"
                            get={state => state.mixer.channels[channel].filter.current}
                            set={value => setFilter(channel, value)}
                            role={MAPPING[`MIXER_CHANNEL_${channel}_FILTER`]}/>
                    </div>
                </div>

                <BinaryButton
                    className="btn-cue"
                    disabled={!this.props.cueEnabled}
                    {...((!this.props.cueEnabled) ? {"data-tooltip": this.cueNotSupportedMsg} : {})}
                    get={ state => !!state.mixer.channels[channel].cue.current}
                    set={ value => setCue(channel, value)}
                    role={MAPPING[`MIXER_CHANNEL_${channel}_CUE`]}>
                        <FontAwesomeIcon icon={faHeadphones}/>
                </BinaryButton>

                <div className="mixer-group group-fx">
                    <BinaryButton
                        className="btn-fx"
                        get={state => state.mixer.channels[channel].sends[0]}
                        set={value => setSend(channel, 1, value)}
                        role={MAPPING[`MIXER_CHANNEL_${channel}_FX_1`]}>
                            FX 1
                    </BinaryButton>
                    <BinaryButton
                        className="btn-fx"
                        get={state => state.mixer.channels[channel].sends[1]}
                        set={value => setSend(channel, 2, value)}
                        role={MAPPING[`MIXER_CHANNEL_${channel}_FX_2`]}>
                            FX 2
                    </BinaryButton>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    cueEnabled: state.mixer.cueEnabled,
    chReady: state.console.channel[ownProps.name].playBackState.ready,
})


export default connect(mapStateToProps)(Channel);