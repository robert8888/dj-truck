import React, {useMemo} from "react";
import {Button} from "react-bootstrap"
import "./controls..scss"

const Controls = ({next, close, current, length, lock}) =>{
    const buttonText = useMemo(() => {
        if(!current){
            return "let's start"
        } else if(current === length - 1){
            return "close"
        }
        return "next step"
    }, [current, length])

    return (
        <div className={"rtg__control"} data-custom>
            <Button
                className={"rtg__control__button " + (lock === current ? "rtg__control__button--locked" : "")}
                onClick={current !== length - 1 ? next: close}>
                {buttonText}
            </Button>
        </div>
    )
}

export default Controls;