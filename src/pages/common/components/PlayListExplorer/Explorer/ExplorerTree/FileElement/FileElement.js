import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClassName from "classnames";
import React, { useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { connect } from "react-redux";
import UUID from "uuidjs";
import ItemTypes from "../../../../../DndItemTypes";
import { copyTrackToList } from "./../../../../../../../actions";

const FileElement = props => {
    const {
        name,
        path,
        renameMode,
        renameInput,
        addTrackToList,
    } = props;

    const fullPath = [...path, name]
    const ref = useRef(null)

    const handleDrop = useCallback((item) => {
        addTrackToList(item.track, fullPath)
    }, [addTrackToList, fullPath])

    const [, drag] = useDrag({
        item: {
            type: ItemTypes.FILE,
            fullPath: fullPath
        },
    })

    const [, drop] = useDrop({
        accept: ItemTypes.TRACK,
        drop: handleDrop
    })

    let currentSelected = (fullPath.join("") === props.currentSelection.join(""));
    let currentlyOpen = (fullPath.join("") === props.currentPlaylist.join(""));


    const liClassList = ClassName(
        "list-item item-file",
        { "item--selected": currentSelected },
        { "item--curently-open" : currentlyOpen }
    )
    
    let content = name
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
    currentSelection: state.playList.currentSelection,
    currentPlaylist: state.playList.currentPlaylist
})

const mapDispatchToProps = dispatch => ({
    addTrackToList: (track, path) => dispatch(copyTrackToList(track, path))
})

export default connect(mapStateToProps, mapDispatchToProps)(FileElement);

