import React, { useRef, useCallback } from "react"

const RenameIntput = props => {
    const onChange = props.onChange;
    const renameInputRef = useRef();

    const callOnChange = useCallback(()=>{
        if(onChange && renameInputRef.current){
            onChange(renameInputRef.current.value);
        }
    }, [onChange, renameInputRef])

    return (
        <input
            type="text"
            className="rename-input"
            defaultValue={props.name}
            ref={renameInputRef}
            onBlur={callOnChange.bind(null)}
            onKeyPress={event => { if (event.key === "Enter") callOnChange() }}
            autoFocus
        />
    )
}    

export default RenameIntput;