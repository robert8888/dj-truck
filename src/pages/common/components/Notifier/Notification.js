import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import "./notification.scss"

const Notification = ({data, onClose, hidden}) =>{
    return (
        <div className={"c-notification " + (hidden ? "c-notification--hidden" : "")}>
            <main className={"c-notification__container"}>
                <header className={"c-notification__header"}>
                    <h6 className={"c-notification__title"}>{data.title}</h6>
                    <button className={"c-notification__button-close"} onClick={onClose}>
                        <FontAwesomeIcon icon={faTimesCircle}/>
                    </button>
                </header>
                <section  className={"c-notification__content"}>
                    <p>
                        {data.content}
                    </p>
                </section>
            </main>
        </div>
    )
}

export default Notification;