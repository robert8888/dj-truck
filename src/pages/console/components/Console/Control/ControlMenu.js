import React, {useEffect, useState, useMemo, useCallback, useRef} from "react";
import {connect} from "react-redux";
import {
    setMappingState,
    setMidiPort,
    setCurrentProfile,
    reqDeleteProfile,
    reqCreateProfile, reqUpdateProfile,
} from "../../../../../actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs} from "@fortawesome/free-solid-svg-icons"
import {Button, Form} from "react-bootstrap";
import Modal from "./../../../../common/components/Modal/Modal";
import UUID from "uuidjs";
import classNames from "classnames";
import "./control-menu.scss";

const mapStateToProps = state =>({
    currentPort : state.control.port,

    currentMidiProfileId : state.control.currentMidiProfileId,
    currentKbdProfileId: state.control.currentKbdProfileId,

    profilesList : state.control.profileList,

    mappingMode: state.control.mapping,
})

const mapDispatchToProps = dispatch => ({
    updatePort : (port) => dispatch(setMidiPort(port)),
    setMappingMode: (value) => dispatch(setMappingState(value)),
    setProfile : (id, profileType) => dispatch(setCurrentProfile(id, profileType)),

    reqCreateProfile: (name, profileType) => dispatch(reqCreateProfile(name, profileType)),
    reqUpdateProfile: profile => dispatch(reqUpdateProfile(profile)),
    reqDeleteProfile: profile => dispatch(reqDeleteProfile(profile)),
})

const ControlMenu = ({
    currentPort, updatePort,

    mappingMode, setMappingMode,
    profilesList,
    currentMidiProfileId, currentKbdProfileId,
    setProfile,
    reqCreateProfile, reqUpdateProfile, reqDeleteProfile,
     }) => {
    const [midiDisabled, setMidiDisabled] = useState(false);
    const [modalState, setModalState] = useState(["hidden", "visible"][0]);
    const [midiIns, setMidiIns] = useState(null);
    const [collapsed, setCollapsed] = useState(true);
    const profileNameInput = useRef();
    const profileType = useRef();
    const modalType = useRef();

    const midiProfiles = useMemo(()=>
        profilesList.filter(profile => profile.type === "midi")
    ,[profilesList])

    const kbdProfiles = useMemo(()=>
            profilesList.filter(profile => profile.type === "kbd")
    ,[profilesList])

    useEffect(()=>{
        navigator.requestMIDIAccess({sysex:true})
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
        reqDeleteProfile(type);
    }, [reqDeleteProfile]);

    const modalConfirm = useCallback(()=>{
        const name = profileNameInput.current.value;
        const type = profileType.current;
        const mode = modalType.current;
        if(mode === "create"){
            reqCreateProfile(name, type)
        } else if(mode === "edit") {
            reqUpdateProfile(name, type)
        }

        setModalState("hidden")
    }, [reqUpdateProfile, profileNameInput, modalType,
             profileType, reqCreateProfile, setModalState])

    const menuCrudItems = useCallback( type => {
        const items = [];
        items.push((
            <li key={"control-nav-item-create"}
                className={"control__nav__item control__nav__item--create"}
                onClick={() => {
                    setModalState("visible");
                    profileType.current = type;
                    modalType.current = "create";
                }}>
                    Create new
            </li>
        ))
        items.push((
            <li key={"control-nav-item-edit"}
                className={"control__nav__item control__nav__item--edit" +
                          (mappingMode === type ? "control__nav__item-active" : "")}
                onClick={()=>{ setMappingMode(mappingMode === type ? null : type)}} >
                {((mappingMode === type) ? "Finish " : "") + "Edit"}

            </li>
        ))
        items.push((
            <li key={"control-nav-item-rename"}
                className={"control__nav__item control__nav__item--rename"}
                onClick={() => {
                    setModalState("visible");
                    profileNameInput.current.value = profilesList.find( profile =>
                           (type === "midi" && profile.id === currentMidiProfileId)
                        || (type === "kbd" && profile.id === currentKbdProfileId)
                    )?.name || ""
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
    }, [setMappingMode, mappingMode, deleteProfile, setModalState,
        currentMidiProfileId, currentKbdProfileId, profilesList]);

    const profilesMenuItems = useCallback((type)=>{
        const profiles = type === "midi" ? midiProfiles : kbdProfiles;
        const currentId = type === "midi" ? currentMidiProfileId : currentKbdProfileId;
        const items = (profiles && profiles.length && profiles.map( profile => {
            const classes = classNames(
                "control__nav__item", {
                    "control__nav__item--current": profile.id === currentId,
                }
            )
            return (
                <li key={UUID.genV1()}  className={classes}
                    onClick={setProfile.bind(null, profile.id, type)}>
                        {profile.name}
                </li>
            )
        })) || [];
        items.push((<li key={"control-nav-item-spacer-1"} className={"control__nav__item control__nav__item--spacer"}/>))

        return items.concat(menuCrudItems(type));
    }, [midiProfiles, currentMidiProfileId,
             currentKbdProfileId, kbdProfiles, setProfile, menuCrudItems])

    const midiProfilesMenuItems = useMemo(() => profilesMenuItems("midi"), [profilesMenuItems])

    const kbdProfilesMenuItems = useMemo(() => profilesMenuItems("kbd"), [profilesMenuItems])

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
                            {midiProfilesMenuItems}
                        </ul>
                    </li>
                    <li className={"control__nav__item"}>
                        Keyboard profiles
                        <ul className={"control__nav control__nav__sub"}>
                            {kbdProfilesMenuItems}
                        </ul>
                    </li>
                </ul>
            </nav>


            <Modal show={(modalState === "visible")}
                   title={"Profile name"}
                   onHide={setModalState.bind(null,"hidden")}>
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



export default connect(mapStateToProps, mapDispatchToProps)(ControlMenu);