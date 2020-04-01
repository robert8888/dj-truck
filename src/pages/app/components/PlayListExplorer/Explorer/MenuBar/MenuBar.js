import React, { useState, useRef, useCallback } from "react";
import {connect} from "react-redux";
import "./menu-bar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus, faFile } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import {
    createDir,
    createPlaylist
} from "./../../../../../../actions";

const MenuBar = props => {
    const [type, setType] = useState(null);
    const nameInput = useRef();
    const dirButton = useRef();
    const fileButton = useRef();

    const clear = useCallback(()=>{
        dirButton.current.blur();
        fileButton.current.blur();
        nameInput.current.blur();
        nameInput.current.value=""
    }, [dirButton, fileButton, nameInput])

    const creatClickHandler = useCallback(type => {
        if (type === "dir") {
            dirButton.current.focus();
        } else if (type === "file") {
            fileButton.current.focus()
        }
        setType(type);
        nameInput.current.focus();
    }, [nameInput, setType])

    const createElement = useCallback(() => {
        props.createElement(type, nameInput.current.value)
        clear();
    }, [type, nameInput, clear, props.createElement])

    const clearAction = useCallback(()=>{
        setType(null);
        clear();
    }, [setType, clear])


    return (
        <div className="menu-bar">
            <h6 className="title">Explorer</h6>
            <Form.Control
                ref={nameInput}
                className="file-name-input"
                type="text" size="sm"
                onKeyPress={e => { if (e.key === "Enter") { createElement() } }}
                onBlur={clearAction.bind(null)}
            />
            <div className="flex-spacer" />
            <button
                ref={dirButton}
                className="btn-transparent btn-new-file"
                onClick={creatClickHandler.bind(null, "dir")}>
                <FontAwesomeIcon
                    className="icon icon-new-folder"
                    icon={faFolderPlus} />
            </button>
            <button
                ref={fileButton}
                className="btn-transparent btn-new-file"
                onClick={creatClickHandler.bind(null, "file")}>
                <FontAwesomeIcon
                    className="icon icon-new-file"
                    icon={faFile} />
            </button>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    createElement : (type, name) => {
        if(type === "dir"){
            dispatch(createDir(name))
        } else if(type === "file"){
            dispatch(createPlaylist(name))
        }
    }
})

export default connect(null, mapDispatchToProps)(MenuBar);