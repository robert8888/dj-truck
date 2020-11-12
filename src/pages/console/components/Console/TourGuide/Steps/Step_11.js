import React, {useMemo} from "react";
import {Step} from "react-rtg";
import useStateValueAnimator from "../utils/useStateAnimator";
import {setLoopLength} from "../../../../../../actions";
import useEventDispatcher from "../utils/useEventDispatcher";

export default function useStep_11(){
    const dispatchEvent = useEventDispatcher();

    const loopLengthAnimation = useStateValueAnimator({
        action: setLoopLength.bind(null, "A"),
        from: 8,
        to: 10,
        duration: 3000,
        resolution: 2
    })

    loopLengthAnimation.onEnd = () =>{
        dispatchEvent(
            document.querySelector(".btn--in.btn-primary"),
            [MouseEvent, "click"]
        )
    }

    return useMemo(() => (
        <Step
            key={"Step_11"}
            placement={"top"}
            selector={".controls__looper--A"}
            onShow={loopLengthAnimation.start}
            approve={{
                lock: true,
                callback: () => loopLengthAnimation.state === "finished"
            }}>
            <p>
                Adjust loop length and turn it on
            </p>
            <p>
                loop work in full sync. feel free to change it length in any moment
            </p>
        </Step>
    ), [loopLengthAnimation])
}
