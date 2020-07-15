import React, { useMemo, useEffect, useState } from "react";
import {connect} from "react-redux";
import "./master.scss";
import Console from "./../../../../core/console/console";
import VolumePeekLevelMeter from "./../componets/VoluemPeakLevelMeter/VolumePeakLevelMeter";
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
import {toGainCurve} from "../../../../../../utils/sound/converter";

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
            <VolumePeekLevelMeter
                aspect={"horizontal"}
                update ={ value => props.setPreGain(toGainCurve(value))}
                active={true}
                interface={mixerInterface?.getPeakMeter("pre")} />
            <ThresholdKnob onChange={props.setThreshold}/>
            <RatioKnob onChange={props.setRatio}/>
            <AttackKnob onChange={props.setAttack}/>
            <ReleaseKnob onChange={props.setRelease}/>
            <VolumePeekLevelMeter
                aspect={"horizontal"}
                update ={value => props.setPostGain(toGainCurve(value))}
                active={true}
                interface={ mixerInterface?.getPeakMeter("post")}/>
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