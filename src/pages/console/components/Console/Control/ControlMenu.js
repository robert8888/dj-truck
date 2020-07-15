import React, {useEffect, useState, useMemo, useCallback, useRef} from "react";
import {connect} from "react-redux";
import {
    setMidiMappingState,
    setMidiPort,
    setCurrentMidiProfile,
    reqDeleteMidiProfile,
    reqCreateMidiProfile, reqUpdateMidiProfile,
} from "../../../../../actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs} from "@fortawesome/free-solid-svg-icons"
import {Button, Form} from "react-bootstrap";
import Modal from "./../../../../common/components/Modal/Modal";
import UUID from "uuidjs";
import classNames from "classnames";
import "./control-menu.scss";

const ControlMenu = ({
    currentPort, updatePort,

    midiMappingMode, setMidiMappingMode, midiProfiles,
    currentMidiProfileId, setMidiProfile,
    createMidiProfile, updateMidiProfile, deleteMidiProfile,

    kbdMappingMode, setKbdMappingMode,
    createKbdProfile, updateKbdProfile, deleteKbdProfile,
                     }) => {
    const [midiDisabled, setMidiDisabled] = useState(false);
    const [modalState, setModalState] = useState(["hidden", "visible"][0]);
    const [midiIns, setMidiIns] = useState(null);
    const [collapsed, setCollapsed] = useState(true);
    const profileNameInput = useRef();
    const profileType = useRef();
    const modalType = useRef();

    useEffect(()=>{
        navigator.requestMIDIAccess()
            .then((webMidi)=>{
                const ports = [];
                webMidi.inputs.forEach( port => ports.push(port))
                setMidiIns(ports);
            }, () => {
                setMidiDisabled(true)
            });
    }, [setMidiDisabled, setMidiIns])

    const setPort = useCallback( port => {
        updatePort(port)
    }, [updatePort])

    const ports = useMemo(()=>{
        if(!midiIns || (midiIns && !midiIns.length)) return null;
        return midiIns.map( port => {
            const classes = classNames(
                "control__nav__item", {
                    "control__nav__item--current": port.id === currentPort?.id,
                }
            )
            return (
                <li key={UUID.genV1()}  className={classes} onClick={setPort.bind(null, port)}>
                    {port.name}
                </li>
            )
        })
    }, [midiIns, setPort, currentPort])

    const deleteProfile = useCallback((type) => {
        if(type === "midi"){
            deleteMidiProfile();
        } else if(type === "kbd"){
            deleteKbdProfile();
        }
    }, [deleteMidiProfile, deleteKbdProfile]);

    const modalConfirm = useCallback(()=>{
        const name = profileNameInput.current.value;
        const type = profileType.current;
        const mode = modalType.current;
        if(type === "midi"){
            if(mode === "create"){
                createMidiProfile(name)
            } else if(mode === "edit"){
                updateMidiProfile({id: currentMidiProfileId, name})
            }
        } else if(type === "kbd"){
            if(mode === "create"){
                createKbdProfile(name)
            } else if(mode === "edit"){
                updateKbdProfile(name);
            }
        }

        setModalState("hidden")
    }, [currentMidiProfileId, updateKbdProfile, updateMidiProfile,
             profileNameInput, profileType, createMidiProfile,
             createKbdProfile, setModalState])

    const menuCrudItems = useCallback( type => {
        const items = [];
        items.push((
            <li key={"control-nav-item-create"} className={"control__nav__item control__nav__item--create"}
                onClick={() => {
                    setModalState("visible");
                    profileType.current = type;
                    modalType.current = "create";
                }}>
                    Create new
            </li>
        ))
        items.push((
            <li key={"control-nav-item-edit"} className={"control__nav__item control__nav__item--edit"}
                onClick={()=>{
                    type === "midi" ?
                        setMidiMappingMode(!midiMappingMode) :
                        setKbdMappingMode(!kbdMappingMode);
                    }
                }>
                {(((type=== "midi" && midiMappingMode) ||
                   (type === "kbd" && kbdMappingMode))
                    ? "Finish " : "") + "Edit"}
            </li>
        ))
        items.push((
            <li key={"control-nav-item-rename"} className={"control__nav__item control__nav__item--rename"}
                onClick={() => {
                    setModalState("visible");
                    profileType.current = type;
                    modalType.current = "edit";
                }}>
                    Rename current
            </li>
        ))
        items.push((
            <li key={"control-nav-item-delete"} className={"control__nav__item control__nav__item--delete"}
                onClick={deleteProfile.bind(null, type)}>
                    Delete current
            </li>
        ))
        return items;
    }, [setMidiMappingMode, setKbdMappingMode, kbdMappingMode,
             midiMappingMode, deleteProfile, setModalState])

    const midiProfilesMenu = useMemo(()=>{
        const items = (midiProfiles && midiProfiles.length && midiProfiles.map( profile => {
            const classes = classNames(
                "control__nav__item", {
                    "control__nav__item--current": profile.id === currentMidiProfileId,
                }
            )
            return (
                <li key={UUID.genV1()}  className={classes} onClick={setMidiProfile.bind(null, profile.id)}>
                    {profile.name}
                </li>
            )
        })) || [];
        items.push((<li key={"control-nav-item-spacer-1"} className={"control__nav__item control__nav__item--spacer"}/>))

        return items.concat(menuCrudItems("midi"));
    }, [midiProfiles, currentMidiProfileId, setMidiProfile, menuCrudItems])

    return (
        <div className="control component">
            <div className="component__label">CFG</div>
            <nav className={"control__nav__container"} onMouseLeave={setCollapsed.bind(null, true)}>
                <Button className={"control__nav__button"} onClick={setCollapsed.bind(null, false)}>
                    <FontAwesomeIcon icon={faCogs}/>
                </Button>
                <ul className={"control__nav control__nav--" + (collapsed ? "collapsed" : "expanded")}>
                    <li className={"control__nav__item" + ((midiDisabled) ? " control__nav__item--disabled" : "")}>
                        Midi ports
                        <ul className={"control__nav control__nav__sub"}>
                            {ports}
                        </ul>
                    </li>

                    <li className={"control__nav__item"}>
                        Midi profiles
                        <ul className={"control__nav control__nav__sub"}>
                            {midiProfilesMenu}
                        </ul>
                    </li>
                    <li className={"control__nav__item"}>Keyboard profiles</li>
                </ul>
            </nav>


            <Modal show={(modalState === "visible")} title={"Profile name"} onHide={setModalState.bind(null,"hidden")}>
                <div className={"modal__content"}>
                    <Form.Group>
                        <Form.Control
                            name={"profile-name"}
                            ref={profileNameInput}
                            className={"modal__content__profile-name"}
                            type={"text"}/>
                    </Form.Group>
                    <Button
                        onClick={modalConfirm}
                        className={"modal__content__confirm-btn"}>
                            Create midi profile
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

const mapStateToProps = state =>({
    currentPort : state.midi.port,

    currentMidiProfileId : state.midi.currentProfileId,
    midiProfiles : state.midi.profileList,

    kbdMappingMode: null,
    midiMappingMode: state.midi.mapping,
})

const mapDispatchToProps = dispatch => ({
    updatePort : (port) => dispatch(setMidiPort(port)),
    setMidiMappingMode: (value) => dispatch(setMidiMappingState(value)),
    setMidiProfile : (id) => dispatch(setCurrentMidiProfile(id)),

    createMidiProfile: name => dispatch(reqCreateMidiProfile(name)),
    updateMidiProfile: profile => dispatch(reqUpdateMidiProfile(profile)),
    deleteMidiProfile: profile => dispatch(reqDeleteMidiProfile(profile)),

    setKbdMappingMode: () => console.log("kbd mapping mode not implemented"),
    createKbdProfile: () => console.log("create midi profile, im not implemented"),
    updateKbdProfile: () => console.log("update midi profile"),
    deleteKbdProfile: () => console.log("delete kbd profile,  im not implemented")
})

export default connect(mapStateToProps, mapDispatchToProps)(ControlMenu);