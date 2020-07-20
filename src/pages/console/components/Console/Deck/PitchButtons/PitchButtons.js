import React from "react"
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import {increasePitch, decreasePitch} from "./../../../../../../actions";
import "./pitch-buttons.scss"

const buttonStepAmount = 0.01;

const PitchButtons = props =>{

    const mouseDown = action => {
        action();
        const lastPressed = new Date().getTime();
        let amount = buttonStepAmount;
        const intervalHandle = setInterval(()=>{
            const now = new Date().getTime();
            if( now - lastPressed > 1000 ){
                action(amount);
                amount += buttonStepAmount;
            }
        }, 100)
        const mouseUp = () => {
            clearInterval(intervalHandle);
            window.removeEventListener('mouseup', mouseUp);
            window.removeEventListener('mouseleave', mouseUp);
        }
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('mouseleave', mouseUp);
    }

    return (
        <div className={"controls__pitch controls__pitch--" + props.name}>
            <Button className="btn--pitch btn--increase"
                    onMouseDown={ mouseDown.bind(null, props.increaseBpm) }
                    > + </Button>
            <Button className="btn--pitch btn--decrease"
                    onMouseDown={ mouseDown.bind(null, props.decreaseBpm) }
                    > - </Button>
        </div>
    )
}

const mapDispatchToProps = (dispatch, ownProps) =>({
    increaseBpm : (amount) => dispatch(increasePitch(ownProps.name, amount || buttonStepAmount)),
    decreaseBpm : (amount) => dispatch(decreasePitch(ownProps.name, amount || buttonStepAmount)),
})

export default connect(null, mapDispatchToProps)(PitchButtons);