import React from "react"
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import {increaseBpm, decreaseBpm} from "./../../../actions/actions";
import "./pitch-buttons.scss"

const buttonStepAmount = 0.01;

const PitchButtons = props =>{

    let intervallHanlder = null;
    let lastPressed = null;

    const mouseDown = callBack => {
        console.log('mouse down')
        callBack();
        lastPressed = new Date().getTime();
        intervallHanlder = setInterval(()=>{
            const now = new Date().getTime();
            if( now - lastPressed > 1000 ){
                callBack();
            }
        }, 100)
        document.addEventListener('mouseup', mouseUp.bind(null, intervallHanlder))
    }

    const mouseUp = handler => {
        clearInterval(handler);
        document.removeEventListener('mouseup', mouseUp.bind(null, handler));
    }

    //wait 1 seconds and start fastt calling

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
    increaseBpm : () => dispatch(increaseBpm(ownProps.name, buttonStepAmount)),
    decreaseBpm : () => dispatch(decreaseBpm(ownProps.name, buttonStepAmount)),  
})

export default connect(null, mapDispachToProps)(PitchButtons);