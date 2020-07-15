import React from "react"
import PeakLevelMeterV from "./PeakLevelMeterV"
import "./peak-level-meter--horizontal.scss";

const PeakLevelMeterH = props =>{
    return (
        <PeakLevelMeterV className="peak-level-meter--horizontal" {...props}/>
    )
}

export default PeakLevelMeterH;