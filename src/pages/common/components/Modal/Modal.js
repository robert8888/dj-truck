import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import ReactDOM from "react-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWindowClose} from "@fortawesome/free-solid-svg-icons";
import "./modal.scss";
import classNames from "classnames"

const Modal = ({children, onHide, show , title, backdropHide = false}) => {
    const [isVisible, setVisible] = useState(show ?? false);
    const mouseDown = useRef();

    const showModal = useCallback(() => {
        if(!mouseDown.current) return;
        setVisible(true);
        window.addEventListener("mousedown", mouseDown.current)
    },[setVisible, mouseDown]);

    const hideModal = useCallback(() =>{
        setVisible(false);
        window.removeEventListener("mousedown", mouseDown.current);
        onHide && onHide instanceof Function && onHide();
    }, [setVisible, mouseDown, onHide])

    mouseDown.current = useCallback(({target})=>{
        if(!backdropHide) return;
        if(target.closest(".modal__container")) return;
        hideModal();
    },[hideModal, backdropHide])

    useEffect(()=>{
        show ? showModal() : hideModal();
    }, [show, showModal, hideModal])


    const containerClass = useMemo(()=> classNames(
        "modal", {
            "modal--visible": isVisible,
        }
    ), [isVisible])

    return ReactDOM.createPortal((
        <div className={containerClass}>
            <div className={"modal__container"}>
                <div className={"modal__header"}>
                    <button className={"modal__close-btn"}
                            onClick={hideModal}>
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