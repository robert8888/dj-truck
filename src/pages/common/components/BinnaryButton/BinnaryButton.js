import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";


const BinnaryButton = props => {
    const [state, setState] = useState( props.initValue || 0);
    const {onChange, className, dispatch, ...rest} = props;

    const clickHandle = (event)=> {
        event.stopPropagation();
        let nextState;
        if(props.value !== null && props.value !== undefined){
            nextState = props.value ? 0 : 1;
        } else {
            nextState = state ? 0 : 1    
        }
        setState(nextState);
        if(props.onChange){
            props.onChange(nextState)
        }
    }

    useEffect(()=>{
        setState(props.value);
    }, [props.value])

    return (
        <Button 
            className={ className + ((!!state) ? " btn--pressed-filed" : "")} 
            onClick = {clickHandle}
            {...rest}>
                {props.children}
        </Button>
    )
}

export default BinnaryButton;