import { faDownload, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from "react";
import UUID from "uuidjs";
import "./icon-bar.scss";

const IconBar = ({ items, className }) => {
    const [icons,] = useState({
        download: faDownload,
        edit: faEdit,
        delete: faTrash,
    })

    return (
        <div className={"icon-bar " + (className || "")}>
            <ul className="icon-list">
                {items && Object.entries(items).map(([key, value]) => {
                    return (<li key={UUID.genV1()} data-tooltip={key} >
                        <FontAwesomeIcon
                            className={'icon icon-' + key}
                            icon={icons[key]}
                            onClick={value.bind(null)} />
                    </li>)
                })}
            </ul>
        </div>
    )
}

export default IconBar;