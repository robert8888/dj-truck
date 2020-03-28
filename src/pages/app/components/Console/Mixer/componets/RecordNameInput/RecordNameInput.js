import React from "react"
import { Form } from "react-bootstrap"


const RecordNameInput = props =>{

    return(
        <Form.Control 
            className="record-name-input" 
            placeholder="Name of your set" 
            type="text" 
            disabled={props.disabled}
            onChange={v=>console.log(v)}/>
    )
}


export default RecordNameInput;