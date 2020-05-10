import {useEffect, useCallback} from "react"

export default function (){
    const updateHeight = useCallback((control)=>{
        if(!control) return;
        control.style.height = 0;
        control.style.height = control.scrollHeight + "px";
    })

    const onInput = useCallback((event) => {
        if(!event.target ) return;
        if(!(event.target instanceof HTMLTextAreaElement)) return;
        updateHeight(event.target)
    }, [updateHeight])

    const addRef = (control)=>{
        if(!control) return;
        control.style.overflow = 'hidden';
        updateHeight(control)
        control.addEventListener('input', onInput);
        return control
    }

    return [addRef]
}