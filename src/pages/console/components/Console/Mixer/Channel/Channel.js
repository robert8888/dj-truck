import React from "react";
import {connect} from "react-redux";
import throttle from 'lodash/throttle';
import Console from "./../../../../core/console/console";
import EqKnob from "./../componets/EqKnob/EqKnob"
import GainKnob from "./../componets/GainKnob/GainKnob";
import FilterKnob from "./../componets/FilterKnob/FitlerKnob";
import ResonanceKnob from "./../componets/ResonasKnob/ResonansKnob";
import BinaryButton from "./../../../../../common/components/BinnaryButton/BinnaryButton";
import PeakLevelMeter from "./../componets/PeakLevelMeter/PeakLevelMeterV";
import {
    setGain,
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

class Channel extends React.Component{
    cueNotSupportedMsg = `Sorry your device not support this`;
    state = {
        console : null
    }

    componentDidMount() {
        Console.Get().then( instance => this.setState({
            ...this.state,
            console : instance,
        }))
    }

    render(){
        return (
            <div className={"mixer-channel channel-" + this.props.name }>

                <div className="knobs-set-1">
                    <EqKnob alt="Hi"
                            className="eq-hi"
                            value={this.props.highValue}
                            onChange={ this.props.setHi }
                            role={MAPPING.MIXER_CHANNEL_EQ_HI(this.props.name)}/>
                    <EqKnob alt="Mid"
                            className="eq-mid"
                            value={this.props.midValue}
                            onChange={this.props.setMid }
                            role={MAPPING.MIXER_CHANNEL_EQ_MID(this.props.name)}/>
                    <EqKnob alt="Low"
                            className="eq-low"
                            value={this.props.lowValue}
                            onChange={ this.props.setLow }
                            role={MAPPING.MIXER_CHANNEL_EQ_LOW(this.props.name)}/>

                </div>
                <PeakLevelMeter 
                    name={this.props.name}
                    active={this.props.chReady}
                    interface={ this.state.console && this.state.console.getMixerChannelInterface(this.props.name) }/>
                <div className="knobs-set-2">
                    <GainKnob
                        className="eq-gain"
                        value={this.props.gainValue}
                        onChange={ this.props.setGain }
                        role={MAPPING.MIXER_CHANNEL_GAIN(this.props.name)}/>
                    <div className="mixer-group">
                        <ResonanceKnob
                            alt="RES" 
                            className="resonans"
                            value={this.props.filterResonanceValue}
                            onChange={ this.props.setFilterResonance }
                            role={MAPPING.MIXER_CHANNEL_RESONANCE(this.props.name)}
                            />
                        <FilterKnob 
                            alt="FL" 
                            className="filter"
                            value={this.props.filterValue}
                            onChange={ this.props.setFilter}
                            role={MAPPING.MIXER_CHANNEL_FILTER(this.props.name)}/>
                    </div>
                </div>
                <BinaryButton
                            className="btn-cue" 
                            value={this.props.cueValue}
                            disabled= {!this.props.cueEnabled}
                            {...((!this.props.cueEnabled ) ? { "data-tooltip" : this.cueNotSupportedMsg } : {})}
                            onChange={this.props.setCue.bind(null)}
                            role={MAPPING.MIXER_CHANNEL_CUE(this.props.name)}>
                                <FontAwesomeIcon icon={faHeadphones}/>
                </BinaryButton>

                <div className="mixer-group group-fx">
                        <BinaryButton
                            className="btn-fx" 
                            value={this.props.send1}
                            onChange={this.props.setSend.bind(null, 1)}
                            role={MAPPING.MIXER_CHANNEL_FX(this.props.name, 1)}>
                                FX 1
                        </BinaryButton>
                        <BinaryButton
                            className="btn-fx" 
                            value={this.props.send2}
                            onChange={this.props.setSend.bind(null, 2)}
                            role={MAPPING.MIXER_CHANNEL_FX(this.props.name, 2)}>
                                FX 2
                        </BinaryButton>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state, ownProps) => ({
    cueEnabled : state.mixer.cueEnabled,
    send1 : state.mixer.channels[ownProps.name].sends[0],
    send2 : state.mixer.channels[ownProps.name].sends[1],
    chReady: state.console.channel[ownProps.name].playBackState.ready,

    cueValue : state.mixer.channels[ownProps.name].cue,
    lowValue: state.mixer.channels[ownProps.name].low,
    midValue: state.mixer.channels[ownProps.name].mid,
    highValue: state.mixer.channels[ownProps.name].high,
    gainValue: state.mixer.channels[ownProps.name].gain,
    filterValue: state.mixer.channels[ownProps.name].filter,
    filterResonanceValue : state.mixer.channels[ownProps.name].filterResonans,
})

const mapDispachToProps = (dispatch, ownProps) =>{
    const tdispatch = throttle(dispatch, 50);
    return {
    setGain : (value) =>  tdispatch(setGain(ownProps.name, value)),
    setHi : (value) => tdispatch(setHi(ownProps.name, value)),
    setMid : (value) => tdispatch(setMid(ownProps.name, value)),
    setLow : (value) => tdispatch(setLow(ownProps.name, value)),
    setSend : (number, value) => dispatch(setSend(ownProps.name, number, value)),
    setFilter : (value) => tdispatch(setFilter(ownProps.name, value)),
    setFilterResonance : (value) => tdispatch(setFilterResonans(ownProps.name, value)),
    setCue : (value) => tdispatch(setCue(ownProps.name, value))
}}

export default connect(mapStateToProps, mapDispachToProps)(Channel);