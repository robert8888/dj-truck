import React, { useMemo, useEffect, useState } from "react";
import {connect} from "react-redux";
import "./master.scss";
import Console from "./../../../../core/console/console";
import GainKnob from "./../componets/GainKnob/GainKnob";
import PeakLevelMeterH from "../componets/PeakLevelMeter/PeakLevelMeterH";
import ThresholdKnob from "../componets/ThresholdKnob/ThresholdKnob";
import RatioKnob from "../componets/RatioKnob/RatioKnob";
import AttackKnob from "../componets/AttackKnob/AttackKnob";
import ReleaseKnob from "../componets/ReleaseKnob/ReleaseKnob";
import { 
        setPreGain,
        setPostGain,
        setThreshold,
        setRatio,
        setAttack,
        setRelease 
    } from "../../../../../../actions";

const Mastering = props => {
    const [_interface, setInterface] = useState();
    
    const mixerInterface = useMemo(() => {
        return _interface;
    }, [_interface])

    useEffect(() => {
        Console.Get().then(instance => {
            setInterface(instance.getMixerMasterInterface());
        })
    }, [setInterface])

    return (
        <div className="mastering">
            <div className="label">COM</div>
            <GainKnob onChange={ props.setPreGain}/>
            <PeakLevelMeterH
                mastering 
                active={true}
                interface={mixerInterface?.getPrePeakMeter} />
            <ThresholdKnob onChange={props.setThreshold}/>
            <RatioKnob onChange={props.setRatio}/>
            <AttackKnob onChange={props.setAttack}/>
            <ReleaseKnob onChange={props.setRelease}/>
            <GainKnob onChange={props.setPostGain}/>
            <PeakLevelMeterH 
               active={true}
               interface={ mixerInterface?.getPostPeakMeter}/>
        </div>
    )
}

const mapDispatchToProps = dispatch =>({
    setPreGain : value => dispatch(setPreGain(value)),
    setPostGain : value => dispatch(setPostGain(value)),
    
    setThreshold : value => dispatch(setThreshold(value)),
    setRatio : value => dispatch(setRatio(value)),
    setAttack : value => dispatch(setAttack(value)),
    setRelease : value => dispatch(setRelease(value)),
    
})

export default connect(null, mapDispatchToProps)(Mastering);