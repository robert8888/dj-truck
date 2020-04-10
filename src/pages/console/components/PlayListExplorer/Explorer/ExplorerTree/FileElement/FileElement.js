import React, { useRef, useCallback } from "react";
import { connect } from "react-redux"
import UUID from "uuidjs";
import ClassName from "classnames";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemTypes from "../../../../../appItemTypes";
import {useDrag, useDrop} from "react-dnd";
import { addTrackToList } from "./../../../../../../../actions";

const FileElement = props => {
    const { name, path, renameMode, renameInput, addTrackToList } = props;
    const fullPath = [...path, name]
    const ref = useRef(null)

    const handleDrop = useCallback((item)=>{
        addTrackToList(item.track, fullPath)
    }, [addTrackToList])

    const [ , drag] = useDrag({
        item: { 
             type: ItemTypes.FILE,
             fullPath: fullPath
            },
    })

    const [ , drop] = useDrop({
        accept : ItemTypes.TRACK,
        drop: handleDrop
    })

    let currentSelected = false;
    if (fullPath.join("") === props.currentSelection.join("")) {
        currentSelected = true;
    }
    const liClassList = ClassName(
        "list-item item-file",
        { "item--selected": currentSelected }
    )
    let content = name;
    if (currentSelected && renameMode) {
        content = renameInput(name)
    }

    drop(drag(ref))
    return (
        <li
            ref={ref}
            className={liClassList}
            onClick={props.onClick}
            onContextMenu={props.onContextMenu}
            data-path={path.join("/")}
            key={UUID.genV1()}>
            <FontAwesomeIcon className="icon icon-file" icon={faFile} />
            {content}
        </li>
    );
}

const mapStateToProps = state => ({
    currentSelection: state.playList.currentSelection
})

const mapDispatchToProps = dispatch =>({
    addTrackToList : (track, path) => dispatch(addTrackToList(track, path))
})

export default connect(mapStateToProps, mapDispatchToProps)(FileElement);

