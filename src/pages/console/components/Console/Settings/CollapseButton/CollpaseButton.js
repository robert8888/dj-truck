import React, {useCallback, useContext, useMemo} from "react";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronUp, faChevronDown} from "@fortawesome/free-solid-svg-icons";
import consoleCtx from "../../ConsoleCtx";
import {MAPPING, setConsoleState} from "actions"
import "./collapse-button.scss";
import BinaryButton from "pages/common/components/BinnaryButton/BinnaryButton";

const CollapseButton = ({update}) => {
    const consoleContext = useContext(consoleCtx)

    const collapsed = consoleContext.collapse;
    const icon = useMemo(()=>{
       return collapsed
            ? faChevronDown
            : faChevronUp

    }, [collapsed])

    const toggleCollapse = useCallback(()=> {
        update(!consoleContext.collapse)
    }, [consoleContext, update])

    return (
        <div className={"component__collapse-button collapse-button__container"}>
            <div className={"component__wrapper collapse-button__wrapper"}>
                <BinaryButton
                    className={"collapse-button"}
                    value={collapsed}
                    update={toggleCollapse}
                    role={MAPPING.CONSOLE_COLLAPSE}>
                    <FontAwesomeIcon className={"collapse-button__icon"} icon={icon}/>
                </BinaryButton>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    update : value => dispatch(setConsoleState(value))
})

export default connect(null, mapDispatchToProps)(CollapseButton)