import React from "react";
import BinaryButton from "./../../../common/BinnaryButton/BinnaryButton";
import "./effector-button.scss";

const EffectorButton = props => {
    const {className, ...rest} = props;
    return (
    <BinaryButton className={'effector-btn ' + className} {...rest}>{props.children}</BinaryButton>
    )
}

export default EffectorButton;