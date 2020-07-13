import React from "react";
import BinaryButton from "./../../../../../../../common/components/BinnaryButton/BinnaryButton";
import "./effector-button.scss";

const EffectorButton = props => {
    return (
        <BinaryButton className={'effector-btn '} {...props}>{props.children}</BinaryButton>
    )
}

export default EffectorButton;
