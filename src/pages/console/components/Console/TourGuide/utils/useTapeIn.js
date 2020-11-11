import {useCallback} from "react";
import useEventDispatcher from "./useEventDispatcher";

export default function useTapeIn(){
    const dispatchEvent = useEventDispatcher();
    return useCallback((target, text, speed) =>{
        let index = 0;
        target.focus();
        const interval = setInterval(() => {
            index++;
            dispatchEvent(
                target,
                [Event, "input"],
                {value: text.substr(0, index )}
                )

            if(index === text.length + 1){
                dispatchEvent(
                    target,
                    [Event, "keypress"],
                    null,
                    {
                        key: "Enter",
                        keyCode: 13
                    }
                )
                clearInterval(interval)
            }
        }, speed)
    }, [dispatchEvent])
}