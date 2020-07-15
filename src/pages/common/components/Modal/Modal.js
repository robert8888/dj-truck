import React, {useCallback, useEffect, useMemo, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWindowClose} from "@fortawesome/free-solid-svg-icons";
import "./modal.scss";
import classNames from "classnames"

const Modal = ({children, onHide, show , title}) => {
    const [isVisible, setVisible] = useState(show ?? false);

    useEffect(()=>{
        setVisible(show)
    }, [setVisible, show])

    const hide = useCallback(()=>{
        setVisible(false)
        onHide();
    }, [setVisible, onHide])

    const containerClass = useMemo(()=> classNames(
        "modal", {
            "modal--visible": isVisible,
        }
    ), [isVisible])

    return (
        <div className={containerClass}>
            <div className={"modal__container"}>
                <div className={"modal__header"}>
                    <button className={"modal__close-btn"}
                            onClick={hide}>
                        <FontAwesomeIcon className={"icon"} icon={faWindowClose}/>
                    </button>
                    {title &&
                        <h4 className={"modal__title"}>{title}</h4>
                    }
                </div>
                <div className={"modal__body"}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal