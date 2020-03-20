import React from "react";
import {connect} from "react-redux";
import EqKnob from "./EqKnob/EqKnob"
import GainKnob from "./GainKnob/GainKnob";
import FilterKnob from "./FilterKnob/FitlerKnob";
import ResonansKnob from "./ResonasKnob/ResonansKnob";
import {Button} from "react-bootstrap"
import PeakLevelMeter from "./PeakLevelMeter/PeakLevelMeter";
import {
    setGain,
    setLow,
    setMid,
    setHi
} from "./../../../../../../actions";

import "./mixer-channel.scss";


class Channel extends React.Component{

    render(){
        return (
            <div className={"mixer-channel channel-" + this.props.name }>

                <div className="knobs-set-1">
                    <EqKnob alt="Hi" className="eq-hi" onChange={ this.props.setHi }/>
                    <EqKnob alt="Mid" className="eq-mid" onChange={this.props.setMid }/>
                    <EqKnob alt="Low" className="eq-low" onChange={ this.props.setLow }/>

                </div>
                <PeakLevelMeter name={this.props.name}/>
                <div className="knobs-set-2">
                    <GainKnob className="eq-gain" onChange={ this.props.setGain }/>
                    <div className="mixer-group">
                        <ResonansKnob alt="RES" className="eq-low" onChange={ this.props.setLow }/>
                        <FilterKnob alt="FL" className="eq-low" onChange={ this.props.setLow }/>
                    </div>
                </div>
                <div className="mixer-group group-fx">
                        <Button className="btn-fx">FX 1</Button>
                        <Button className="btn-fx">FX 2</Button>
                </div>
            </div>
        )
    }

}

const mapDispachToProps = (dispatch, ownProps) =>({
    setGain : (value) => dispatch(setGain(ownProps.name, value)),
    setHi : (value) => dispatch(setHi(ownProps.name, value)),
    setMid : (value) => dispatch(setMid(ownProps.name, value)),
    setLow : (value) => dispatch(setLow(ownProps.name, value)),
})

export default connect(null, mapDispachToProps)(Channel);