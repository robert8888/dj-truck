import React, {useMemo} from "react";
import {Step} from "react-rtg";

export default function useStep_21(){
    return useMemo(() => (
        <Step key={"Step_21"} placement={"center"}>
            <p>
                Congratulations you make your first transition between tracks on
                in dj truck studio
            </p>
            <p>
                Documentation and a detailed description of the software's
                capabilities can be found in the 'Become a dj' section
            </p>
        </Step>
    ), [])
}
