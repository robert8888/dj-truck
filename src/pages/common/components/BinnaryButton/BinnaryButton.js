import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {connect} from "react-redux";

const BinaryButton = ({value, initValue, update, className, children, ...rest}) => {
    const [state, setState] = useState( initValue || 0);

    delete rest.defaults;
    delete rest.get;
    delete rest.set;

    const clickHandle = (event)=> {
        event.stopPropagation();
        let nextState;
        if(value !== null && value !== undefined){
            nextState = value ? 0 : 1;
        } else {
            nextState = state ? 0 : 1    
        }
        setState(nextState);
        if(update){
            update(nextState)
        }
    }

    useEffect(()=>{
        if(value === null || value === undefined) return;
         setState(value);
    }, [value])

    return (
        <Button 
            className={ className + ((!!state) ? " btn--pressed-filed" : "")} 
            onClick = {clickHandle}
            {...rest}>
                {children}
        </Button>
    )
}

const mapStateToProps = (state, {get, defaults, value}) => ({
    value : value ?? (get && get(state)) ?? (defaults && defaults(state)),
})

const mapDispatchToProps = (dispatch, {set, update}) => ({
    update : (value) => ((update && update(value)) ?? (set && dispatch(set(value))))
})

export default connect(mapStateToProps, mapDispatchToProps)(BinaryButton);