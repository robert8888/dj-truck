import { faAngleDown, faAngleRight, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClassName from "classnames";
import React, { useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { connect } from "react-redux";
import UUID from "uuidjs";
import { moveToRequest } from "./../../../../../../../actions";
import ItemTypes from "./../../../../../DndItemTypes";

const DirElement = props => {
    const { name, path, open, empty, renameMode, renameInput, moveTo:moveToHandler } = props;
    const fullPath = [...path, name]
    const ref = useRef(null)

    const handleDrop = useCallback((item) => {
        const pathTo = fullPath;//local
        const pathFrom = item.fullPath;
        moveToHandler(pathFrom, pathTo);
    }, [moveToHandler, fullPath])

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
    moveTo : (pathFrom, pathTo) => dispatch(moveToRequest(pathFrom, pathTo))
})

export default connect(mapStateToProps, mapDispatchToProps)(DirElement);

