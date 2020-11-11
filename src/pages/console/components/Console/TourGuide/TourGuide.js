import React, {useCallback, useEffect, useState} from "react";
import {Tour} from "react-rtg";

import Controls from "./Controls";
import "./../../../../../../node_modules/react-rtg/build/index.css"
import "./tour-guide.scss";

import useStep_1 from "./Steps/Step_1";
import useStep_2 from "./Steps/Step_2";
import useStep_3 from "./Steps/Step_3";
import useStep_4 from "./Steps/Step_4";
import useStep_5 from "./Steps/Step_5";
import useStep_6 from "./Steps/Step_6";
import useStep_7 from "./Steps/Step_7";
import useStep_8 from "./Steps/Step_8";
import useStep_9 from "./Steps/Step_9";
import useStep_10 from "./Steps/Step_10";
import useStep_11 from "./Steps/Step_11";
import useStep_12 from "./Steps/Step_12";
import useStep_13 from "./Steps/Step_13";
import useStep_14 from "./Steps/Step_14";
import useStep_15 from "./Steps/Step_15";
import useStep_16 from "./Steps/Step_16";
import useStep_17 from "./Steps/Step_17";
import useStep_18 from "./Steps/Step_18";
import useStep_19 from "./Steps/Step_19";
import useStep_20 from "./Steps/Step_20";
import useStep_21 from "./Steps/Step_21";

const TourGuide = ((isOpen) => {
    const [open, setOpen] = useState(isOpen);

    useEffect(()=>setOpen(isOpen), [isOpen])

    const renderControls = useCallback((props)=>{
        return <Controls {...props}/>
    }, [])

    const steps = [
        useStep_1(),
        useStep_2(),
        useStep_3(),
        useStep_4(),
        useStep_5(),
        useStep_6(),
        useStep_7(),
        useStep_8(),
        useStep_9(),
        useStep_10(),
        useStep_11(),
        useStep_12(),
        useStep_13(),
        useStep_14(),
        useStep_15(),
        useStep_16(),
        useStep_17(),
        useStep_18(),
        useStep_19(),
        useStep_20(),
        useStep_21(),
    ]

    return (
        <Tour isOpen={open} onClose={setOpen} controls={renderControls}>
            {steps}
        </Tour>
    )
})

export default TourGuide