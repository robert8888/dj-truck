import React, {useCallback, useEffect, useRef} from "react";
import "./switch-button.scss";

const SwitchButton = ({value, onChange, className, ...props}) => {

    return (
        <input
            {...props}
            className={"btn-switch " + className}
            type="checkbox"
            checked={value}
            onChange={e => onChange(e.target.checked)}/>
    )
}

export default SwitchButton