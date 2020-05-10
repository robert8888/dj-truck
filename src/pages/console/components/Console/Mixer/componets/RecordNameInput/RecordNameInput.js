import React from "react"
import { Form } from "react-bootstrap"


const RecordNameInput = props => {

    return (
        <Form.Control
            className="record-name-input"
            placeholder="Record 1"
            type="text"
            disabled={props.disabled}
            value={props.value}
            onChange={e => props.onChange(e.target.value)} />
    )
}


export default RecordNameInput;