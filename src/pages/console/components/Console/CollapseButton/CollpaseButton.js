import React, {useCallback, useContext, useMemo} from "react";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronUp, faChevronDown} from "@fortawesome/free-solid-svg-icons";
import consoleCtx from "./../ConsoleCtx";
import {setConsoleState} from "./../../../../../actions"
import "./collapse-button.scss";
import {connect} from "react-redux";

const CollapseButton = ({update}) => {
    const consoleContext = useContext(consoleCtx)

    const collapsed = consoleContext.collapse;
    const icon = useMemo(()=>{
       return consoleContext.collapse
            ? faChevronDown
            : faChevronUp

    }, [collapsed])

    const toggleCollapse = useCallback(()=> {
        update(!consoleContext.collapse)
    }, [consoleContext])

    return (
        <div className={"component__collapse-button collapse-button__container"}>
            <div className={"component__wrapper collapse-button__wrapper"}>
                <Button className={"collapse-button"} onClick={toggleCollapse}>
                    <FontAwesomeIcon className={"collapse-button__icon"} icon={icon}/>
                </Button>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    update : value => dispatch(setConsoleState(value))
})

export default connect(null, mapDispatchToProps)(CollapseButton)