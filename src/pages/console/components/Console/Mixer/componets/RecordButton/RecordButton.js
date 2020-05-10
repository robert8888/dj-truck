import React, {useState} from "react";
import BinnaryButton from "../../../../../../common/components/BinnaryButton/BinnaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faSquare } from "@fortawesome/free-solid-svg-icons";
import "./record-button.scss"

const RecordButton = props =>{
    const [icon , setIcon] = useState(faCircle);

    const handleChangeState = state => {
        if(props.onChange instanceof Function){
            props.onChange(state);
        }

        if(state){
            setIcon(faSquare)
        } else {
            setIcon(faCircle)
        }
    }

    return (
        <BinnaryButton 
            className="record-btn"
            onChange={handleChangeState}
            disabled={props.disabled}
            data-tooltip="Sorry you have to be logged to have ability to record your sets"> 
                <FontAwesomeIcon 
                    icon={icon} 
                    className="icon icon-record"/>
        </BinnaryButton>
    )
}


export default RecordButton;