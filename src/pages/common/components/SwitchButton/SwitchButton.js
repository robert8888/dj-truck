import React from "react";
import "./switch-button.scss";

const SwitchButton = ({value, onChange, className, ...props}) => {

    return (
        <label className={"c-switch " + className}>
            <input
                {...props}
                className={"c-switch__checkbox"}
                type="checkbox"
                checked={value}
                onChange={e => onChange(e.target.checked)}/>
            <span className={"c-switch__thumb"}/>
        </label>

    )
}

export default SwitchButton