import React, { useCallback, useState, Fragment, useEffect } from "react";
import UUID from "uuidjs";
import { connect } from "react-redux";
import ExplorerContextMenu from "./../../../common/ContextMenu/ContextMenu";
import { ContextMenuTrigger } from "react-contextmenu";
import {
    toggleDirRequest,
    setSelection,
    openCurrentPlaylistRequest,
    renameSelectedRequest,
    deleteSelectedRequest,
    createDirRequest,
    createPlaylistRequest
} from "./../../../../../../actions"
import { isEmpty, sortObj } from "./../../../../../../utils/objects/helpers";
import { useDoubleClick } from "./useDoubleClick";
import RenameInput from "./RenameInput/RenameInput";
import DirElement from "./DirElement/DirElement";
import FileElement from "./FileElement/FileElement";
import "./explorer-tree.scss";

const ExplorerTree = props => {

    const [renameMode, setRenameMode] = useState(false);

    const renameModeFromProps = props.renameMode;
    useEffect(()=>{
        setRenameMode(renameModeFromProps)
    }, [renameModeFromProps, setRenameMode])

    const renameInput = name => {
        return (
            <RenameInput name={name} onChange={value => {
                props.renameSelected(value);
                setRenameMode(false)
            }} />
        )
    }

    const [dirClickHandler] = useDoubleClick({
        clickHandler: (path) => {
            if (!renameMode) {
                props.setSelection(path)
            }
        },
        doubleClickHandler: path => props.toggleDir(path),
    })

    const getDirElement = ({ ...params }) => {
        const fullPath = [...params.path, params.name]
        return (
            <DirElement
                key={UUID.genV1()}
                {...params}
                renameMode={renameMode}
                renameInput={renameInput}
                onClick={dirClickHandler.bind(null, fullPath)}
                buttonClick={props.toggleDir.bind(null, fullPath)}
                onContextMenu={props.setSelection.bind(null, fullPath)}
            />
        )
    }

    const [fileClickHandler] = useDoubleClick({
        clickHandler: (path) => {
            if (!renameMode) {
                props.setSelection(path)
            }
        },
        doubleClickHandler: props.openSelected
    })

    const getFileElement = (name, path) => {
        const fullPath = [...path, name]
        return (
            <FileElement
                key={UUID.genV1()}
                name={name}
                path={path}
                renameMode={renameMode}
                renameInput={renameInput}
                onClick={fileClickHandler.bind(null, fullPath)}
                buttonClick={props.toggleDir.bind(null, fullPath)}
                onContextMenu={props.setSelection.bind(null, fullPath)}
            />
        )
    }

    const renderDirElements = useCallback((name, content, path) => {
        content = sortObj(content);
        if (content instanceof Array) {
            return getFileElement(name, path)
        } else {
            if (content._open === true) {
                return (
                    <Fragment key={UUID.genV1()}>
                        {getDirElement({ name, path, open: true })}
                        {renderDir(content, [...path, name])}
                    </Fragment>
                )
            } else {
                if (isEmpty(content)) {
                    return getDirElement({ name, path, open: false, empty: true })
                }
                return getDirElement({ name, path, open: false })
            }
        }
    })

    const renderDir = useCallback((dir, path) => {
        return (
            <ul className="list-dir dir-content" key={UUID.generate()}>
                {
                    Object.entries(dir).map(([name, content]) => {
                        if (name.startsWith("_")) {
                            return null;
                        }
                        return renderDirElements(name, content, path);
                    })
                }
            </ul>
        )
    })

    return (
        <Fragment>
            <ContextMenuTrigger id="explorer_context_menu" holdToDisplay={-1}>
                <div className="explorer-tree" onClick={props.setSelection.bind(null, ["root"])}>
                    {renderDir(props.root, ['root'])}
                </div>
            </ContextMenuTrigger>

            <ExplorerContextMenu
                id="explorer_context_menu"
                items={{
                    "Add Playlist": () => {
                        props.createPlaylist();
                        //setRenameMode(true)
                    },
                    "Add folder": () => {
                        props.createDir();
                       // setRenameMode(true);
                    },
                    "Rename": setRenameMode.bind(null, true),
                    "Delete": props.deleteSelected.bind(null),
                }} />
        </Fragment>
    )
}

const mapStateToProps = state => ({
    root: state.playList.root,
    currentSelection: state.playList.currentSelection,
    renameMode: state.playList.renameMode,
})

const mapDispatchToProps = dispatch => ({
    toggleDir: path => dispatch(toggleDirRequest(path)),//
    setSelection: path => dispatch(setSelection(path)),
    openSelected: path => dispatch(openCurrentPlaylistRequest(path)),//to request
    renameSelected: newName => dispatch(renameSelectedRequest(newName)),//
    deleteSelected: () => dispatch(deleteSelectedRequest()),//
    createDir: () => dispatch(createDirRequest(null)),//
    createPlaylist: () => dispatch(createPlaylistRequest(null)),//
})

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerTree);