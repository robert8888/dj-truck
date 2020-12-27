import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import ReactDOM from "react-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWindowClose} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames"
import "./modal.scss";

const Modal = ({children, onHide, show , title, backdropHide = false}) => {
    const [isVisible, setVisible] = useState(false);

    const onHideCallback = useRef(() => {});
    useEffect(() => {
        onHideCallback.current = onHide
    }, [onHide, onHideCallback]);

    useEffect(()=>{
        setVisible(show)
    }, [show])

    const mouseDown = useCallback(({target} = {}) =>{
        if((backdropHide || !target?.closest(".modal__close-btn")) &&
          (!backdropHide ||(!target?.closest(".modal__close-btn") && target.closest(".modal__container")))
        ) return;

        setVisible(false)
    }, [setVisible,  backdropHide])

    useEffect(() => {
        if(isVisible){
            window.addEventListener("mousedown", mouseDown)
        } else {
            window.removeEventListener("mousedown", mouseDown);
            onHideCallback.current();
        }
    }, [isVisible, onHideCallback, mouseDown])

    const containerClass = useMemo(()=> classNames(
        "modal", {
            "modal--visible": isVisible,
        }
    ), [isVisible])

    if(!isVisible) return null;

    return ReactDOM.createPortal((
        <div className={containerClass}>
            <div className={"modal__container"}>
                <div className={"modal__header"}>
                    <button className={"modal__close-btn"}
                            onClick={mouseDown}>
                        <FontAwesomeIcon className={"icon"} icon={faWindowClose}/>
                    </button>
                    {title &&
                        <h5 className={"modal__title"}>{title}</h5>
                    }
                </div>
                <div className={"modal__body"}>
                    {children}
                </div>
            </div>
        </div>
    ), document.body);
}

export default Modal