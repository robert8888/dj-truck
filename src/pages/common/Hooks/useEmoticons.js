import React, { useMemo , useCallback, useRef, useState} from 'react';
import {Button} from "react-bootstrap";
import Emoticons from "./../../common/components/Emoticons/Emoticons";

export default function(){
    const toggleRef = useRef();
    const textarea = useRef();

    const onSelectIcon = useCallback((icon, event) => {
        event.preventDefault();
        toggleRef.current();
        let control = textarea.current;
        if(!control) return;

        const before = control.value.substring(0, control.selectionStart);
        const after = control.value.substring(control.selectionEnd, control.value.length);

        control.value = before + icon + after;
  
        const cursorPosition = before.length + icon.length;
        control.focus();
        control.setSelectionRange(cursorPosition, cursorPosition)
    }, [])


    const component = useMemo(() => () => (
                <div className="emoticon" style={{position: 'relative', display:'inline-block',  zIndex:'5000'}}>
                    <Button  onClick={ () => toggleRef.current() } className='emoticon-btn'>😀</Button>
                    <Emoticons toggle={toggleRef} onSelect={onSelectIcon}/>
                </div>)
    , [toggleRef])




    return [textarea, component]
}