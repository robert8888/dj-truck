import React from "react"
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import {increasePitch, decreasePitch} from "./../../../../../../actions";
import "./pitch-buttons.scss"

const buttonStepAmount = 0.01;

const PitchButtons = props =>{

    let intervallHanlder = null;
    let lastPressed = null;

    let mouseUpHandler = null;
    const mouseDown = callBack => {
        callBack();
        lastPressed = new Date().getTime();
        intervallHanlder = setInterval(()=>{
            const now = new Date().getTime();
            if( now - lastPressed > 1000 ){
                callBack();
            }
        }, 100)
        mouseUpHandler = mouseUp.bind(null, intervallHanlder);
        document.body.addEventListener('mouseup', mouseUpHandler)
        document.body.addEventListener('mouseleave', mouseUpHandler);
    }

    const mouseUp = handler => {
        clearInterval(handler);
        document.body.removeEventListener('mouseup', mouseUpHandler);
        document.body.removeEventListener('mouseleave', mouseUpHandler);
    }


    return (
        <div className={"pitch-btns-" + props.name}>
            <Button className="pitch-btn btn-increase" 
                    onMouseDown={ mouseDown.bind(null, props.increaseBpm) }
                    > + </Button>
            <Button className="pitch-btn btn-decrease" 
                    onMouseDown={ mouseDown.bind(null, props.decreaseBpm) }
                    > - </Button>
        </div>
    )
}

const mapDispachToProps = (dispatch, ownProps) =>({
    increaseBpm : () => dispatch(increasePitch(ownProps.name, buttonStepAmount)),
    decreaseBpm : () => dispatch(decreasePitch(ownProps.name, buttonStepAmount)),  
})

export default connect(null, mapDispachToProps)(PitchButtons);