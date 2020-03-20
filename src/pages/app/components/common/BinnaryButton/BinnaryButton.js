import React, {useState} from "react";
import {Button} from "react-bootstrap";


const BinnaryButton = props => {
    const [state, setState] = useState( props.initValue || 0);
    const {onChange, className, ...rest} = props;

    const clickHandle = ()=> {
        const nextState = props.value || state ? 0 : 1;
        setState(nextState);
        props.onChange(state)
    }
    console.log('render button', props.className )
    return (
        <Button 
            className={ className + ((state === 1 ) ? " btn--pressed-filed" : "")} 
            onClick = {clickHandle}
            {...rest}>
                {props.children}
        </Button>
    )
}

export default BinnaryButton;