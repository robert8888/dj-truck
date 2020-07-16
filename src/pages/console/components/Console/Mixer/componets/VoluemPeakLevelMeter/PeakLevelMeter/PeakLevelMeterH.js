import React from "react"
import PeakLevelMeterV from "./PeakLevelMeterV"
import "./peak-level-meter--horizontal.scss";

const PeakLevelMeterH = props =>{
    return (
        <PeakLevelMeterV {...props}/>
    )
}

export default PeakLevelMeterH;