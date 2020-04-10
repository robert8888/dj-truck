import React from "react";
import {connect} from "react-redux";
import EqKnob from "./../componets/EqKnob/EqKnob"
import GainKnob from "./../componets/GainKnob/GainKnob";
import FilterKnob from "./../componets/FilterKnob/FitlerKnob";
import ResonansKnob from "./../componets/ResonasKnob/ResonansKnob";
import BinnaryButton from "./../../../common/BinnaryButton/BinnaryButton";
import PeakLevelMeter from "./../componets/PeakLevelMeter/PeakLevelMeterV";
import {
    setGain,
    setLow,
    setMid,
    setHi,
    setSend,
    setFilter,
    setFilterResonans
} from "./../../../../../../actions";

import "./mixer-channel.scss";
import { throttle } from "./../../../../../../utils/functions/lodash";
import Console from "./../../../../core/console/console";

class Channel extends React.Component{


    render(){
        return (
            <div className={"mixer-channel channel-" + this.props.name }>

                <div className="knobs-set-1">
                    <EqKnob alt="Hi" className="eq-hi" onChange={ this.props.setHi }/>
                    <EqKnob alt="Mid" className="eq-mid" onChange={this.props.setMid }/>
                    <EqKnob alt="Low" className="eq-low" onChange={ this.props.setLow }/>

                </div>
                <PeakLevelMeter 
                    name={this.props.name}
                    active={this.props.chReady}
                    interface={ Console.Get().getMixerChannelInterface(this.props.name) }/>
                <div className="knobs-set-2">
                    <GainKnob className="eq-gain" onChange={ this.props.setGain }/>
                    <div className="mixer-group">
                        <ResonansKnob 
                            alt="RES" 
                            className="resonans" 
                           // value={this.props.filterResonansValue}
                            onChange={ this.props.setFilterResonans } 
                            />
                        <FilterKnob 
                            alt="FL" 
                            className="filter" 
                            onChange={ this.props.setFilter}/>
                    </div>
                </div>
                <div className="mixer-group group-fx">
                        <BinnaryButton 
                            className="btn-fx" 
                            value={this.props.send1}
                            onChange={this.props.setSend.bind(null, 1)}>
                                FX 1
                        </BinnaryButton>
                        <BinnaryButton 
                            className="btn-fx" 
                            value={this.props.send2}
                            onChange={this.props.setSend.bind(null, 2)}>
                                FX 2
                        </BinnaryButton>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state, ownProps) => ({
    send1 : state.mixer.channels[ownProps.name].sends[0],
    send2 : state.mixer.channels[ownProps.name].sends[1],
    chReady: state.console.channel[ownProps.name].playBackState.ready,


   // filterResonansValue : state.mixer.channels[ownProps.name].filterResonans,
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
    setFilterResonans : (value) => tdispatch(setFilterResonans(ownProps.name, value)),
}}

export default connect(mapStateToProps, mapDispachToProps)(Channel);