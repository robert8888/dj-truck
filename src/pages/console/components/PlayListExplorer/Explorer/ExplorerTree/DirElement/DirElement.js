import React, { useRef, useCallback } from "react";
import { connect } from "react-redux";
import ItemTypes from "../../../../../appItemTypes";
import { useDrag, useDrop } from "react-dnd";
import UUID from "uuidjs";
import ClassName from "classnames"
import {
    faFolder,
    faAngleRight,
    faAngleDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { moveTo } from "./../../../../../../../actions";

const DirElement = props => {
    const { name, path, open, empty, renameMode, renameInput, moveTo:moveToHandler } = props;
    const fullPath = [...path, name]
    const ref = useRef(null)

    const handleDrop = useCallback((item) => {
        const pathTo = fullPath;//local
        const pathFrom = item.fullPath;
        moveToHandler(pathFrom, pathTo);
    }, [moveToHandler])

    const [, drag] = useDrag({
        item: {
            type: ItemTypes.DIR,
            fullPath: fullPath
        },
    })

    const [, drop] = useDrop({
        accept: [ItemTypes.FILE, ItemTypes.DIR],
        drop: handleDrop
    })


    let currentSelected = false;
    if ([...path, name].join("") === props.currentSelection.join("")) {
        currentSelected = true;
    }
    const liClassList = ClassName(
        "list-item item-dir",
        { "item-dir--empty": empty },
        { "item--selected": currentSelected }
    )
    let content = name;
    if (currentSelected && renameMode) {
        content = renameInput(name)
    }

    drag(drop(ref))
    return (
        <li
            ref={ref}
            onClick={props.onClick}
            onContextMenu={props.onContextMenu.bind(null, path)}
            className={liClassList}
            data-path={path.join("/")}
            key={UUID.genV1()}>
            {!empty &&
                <button
                    className={"btn-dir " + ((open) ? "btn-dir--expand" : "btn-dir--colapse")}>
                    <FontAwesomeIcon
                        className="icon"
                        icon={(open) ? faAngleDown : faAngleRight}
                        onClick={props.buttonClick.bind(null)} />
                </button>}
            <FontAwesomeIcon className="icon icon-dir" icon={faFolder} />
            {content}
        </li>
    )

}


const mapStateToProps = state => ({
    currentSelection: state.playList.currentSelection
})

const mapDispatchToProps = dispatch =>({
    moveTo : (pathFrom, pathTo) => dispatch(moveTo(pathFrom, pathTo))
})

export default connect(mapStateToProps, mapDispatchToProps)(DirElement);

