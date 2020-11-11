import {useCallback} from "react";

export default function useEventDispatcher(){
    return useCallback((target, [eventInstance, eventName], values, eventProps) => {
        if(!target) return;
        for(let name in values){
            if(!values.hasOwnProperty(name))continue;
            const setValue = Object.getOwnPropertyDescriptor(target.__proto__, name).set;
            setValue.call(target, values[name])
        }

        const event = new eventInstance(eventName, {bubbles: true})
        event.simulated = true;
        for(let name in eventProps){
            if(!eventProps.hasOwnProperty(name))continue;
            event[name] = eventProps[name];
        }
        target.dispatchEvent(event);
    }, [])
}
