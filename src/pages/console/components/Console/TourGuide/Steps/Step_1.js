import React, {useMemo} from "react";
import {Step} from "react-rtg";

export default function useStep_1(){
    return useMemo(() => (
        <Step placement={"center"} key={"Step_1"}>
            <p>
                Welcome this guide will help you to introduce
                to dj truck console operation.
            </p>
        </Step>
    ), [])
}
