import React, {useState, useEffect} from "react";
import Modal from "../Modal/Modal";
import NumberInput from "../NumberInput/NumberInput";
import {Button} from "react-bootstrap";
import "./input-modal.scss";

const InputModal = ({openRef, initValue, onConfirm, title, textContent, buttonText, inputType, inputProps}) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);

    useEffect(() => {
        setValue(initValue)
    }, [initValue, setValue, open])

    useEffect(() => {
        if(openRef && typeof openRef === "function"){
            openRef(setOpen);
        }
    }, [openRef, setOpen])

    const confirm = () => {
        if(typeof onConfirm === "function")
            onConfirm(value)
        setOpen(false)
    }

    return (
        <Modal show={open} title={title} onHide={setOpen.bind(null, false)} backdropHide>
            <div className={"modal__group"}>
                <p className={"modal__text"}>{textContent}</p>
                <NumberInput type={inputType} {...inputProps} value={value} onChange={setValue}/>
            </div>
            <div className={"modal__group"}>
                <Button onClick={confirm}>
                    {buttonText}
                </Button>
            </div>
        </Modal>
    )
}

export default InputModal