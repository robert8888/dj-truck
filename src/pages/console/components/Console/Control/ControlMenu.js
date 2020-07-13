import React, {useEffect, useState, useMemo, useCallback, useRef} from "react";
import {connect} from "react-redux";
import {
    setMidiMappingState,
    setMidiPort,
    setCurrentMidiProfile,
    reqDeleteMidiProfile,
    reqCreateMidiProfile,
} from "../../../../../actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faWindowClose} from "@fortawesome/free-solid-svg-icons"
import {JZZ} from 'jzz';
import UUID from "uuidjs";
import {Button, Form} from "react-bootstrap";
import classNames from "classnames";
import "./control-menu.scss";

const ControlMenu = ({
    currentPort,
    updatePort,

    midiMappingMode,
    setMidiMappingMode,
    kbdMappingMode,
    setKbdMappingMode,

    midiProfiles,
    currentProfileId,
    setCurrentProfile,

    createMidiProfile,
    deleteMidiProfile,


    createKbdProfile,
    deleteKbdProfile,
                     }) => {
    const [engine, setEngine] = useState(null);
    const [midiIns, setMidiIns] = useState(null);
    const modal = useRef();
    const profileNameInput = useRef();
    const profileType = useRef();

    useEffect(()=>{
        let _engine = JZZ();
        setEngine(_engine)
        return () => {
            setEngine(engine => {
                engine.close();
                return null;
            })
        }
    }, [setEngine])

    useEffect(()=>{
        if(!engine) return;
        JZZ.requestMIDIAccess().then(webmidi => {
            const ports = [];
            webmidi.inputs.forEach( port => ports.push(port))
            setMidiIns(ports);
        })

    }, [engine, setMidiIns])

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

    const createProfile = useCallback(()=>{
         const name = profileNameInput.current.value;
         switch (profileType.current){
             case "midi": {
                 createMidiProfile(name);
                 break;
             }
             case "kbd" : {
                 createKbdProfile(name);
                 break;
             }
             default: return null;
         }
         modal.current.classList.remove("modal--visible");
    }, [profileNameInput, profileType, createMidiProfile, createKbdProfile, modal])

    const deleteProfile = useCallback((type) => {
        switch (type){
            case "midi":  deleteMidiProfile(); break;
            case "kbd": deleteKbdProfile(); break;
            default : return null;
        }
    }, [deleteMidiProfile, deleteKbdProfile])

    const menuCrudItems = useCallback( type => {
        const items = [];
        items.push((
            <li key={"control-nav-item-create"} className={"control__nav__item control__nav__item--create"}
                onClick={() => {
                    modal.current.classList.add("modal--visible");
                    profileType.current = type;
                }}>
                Create new
            </li>
        ))
        items.push((
            <li key={"control-nav-item-edit"} className={"control__nav__item control__nav__item--edit"}
                onClick={()=>{
                    switch (type){
                        case "midi" : {
                            setMidiMappingMode(!midiMappingMode);
                            break;
                        }
                        case "kbd" : {
                            setKbdMappingMode(!kbdMappingMode);
                            break;
                        }
                        default : return null;
                    };
                }}>
                {(((type=== "midi" && midiMappingMode) ||
                 (type === "kbd" && kbdMappingMode)) ? "Finish " : "") + "Edit"}
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
             midiMappingMode, deleteProfile])

    const profilesMenu = useMemo(()=>{
        const items = (midiProfiles && midiProfiles.length && midiProfiles.map( profile => {
            const classes = classNames(
                "control__nav__item", {
                    "control__nav__item--current": profile.id === currentProfileId,
                }
            )
            return (
                <li key={UUID.genV1()}  className={classes} onClick={setCurrentProfile.bind(null, profile.id)}>
                    {profile.name}
                </li>
            )
        })) || [];
        items.push((<li key={"control-nav-item-spacer-1"} className={"control__nav__item control__nav__item--spacer"}/>))

        return items.concat(menuCrudItems("midi"));
    }, [midiProfiles, currentProfileId, setCurrentProfile, menuCrudItems])


    return (
        <div className="control">
            <nav className={"control__nav__container"}>
                <Button className={"control__nav__button"}>
                    <FontAwesomeIcon icon={faCogs}/>
                </Button>
                <ul className={"control__nav"}>
                    <li className={"control__nav__item"}>
                        Midi ports
                        <ul className={"control__nav control__nav__sub"}>
                            {ports}
                        </ul>
                    </li>

                    <li className={"control__nav__item"}>
                        Midi profiles
                        <ul className={"control__nav control__nav__sub"}>
                            {profilesMenu}
                        </ul>
                    </li>
                    <li className={"control__nav__item"}>Keyboard profiles</li>
                </ul>
            </nav>
            <div className={"modal"} ref={modal}>
                <div className={"creating-profile"}>
                    <Button className={"creating-profile__btn creating-profile__btn--aboard"}
                        onClick={ () => {modal.current.classList.remove("modal--visible")}}>
                            <FontAwesomeIcon icon={faWindowClose}/>
                    </Button>
                    <Form.Group>
                        <Form.Label htmlFor={"profile-name"}>Profile name</Form.Label>
                        <Form.Control
                            name={"profile-name"}
                            ref={profileNameInput}
                            className={"creating-profile__name"}
                            type={"text"}/>
                    </Form.Group>
                    <Button
                        onClick={createProfile}
                        className={"creating-profile__btn"}>
                        Create midi profile
                    </Button>
                </div>
            </div>
        </div>

    )
}

const mapStateToProps = state =>({
    currentPort : state.midi.port,

    currentProfileId : state.midi.currentProfileId,
    midiProfiles : state.midi.profileList,

    kbdMappingMode: null,
    midiMappingMode: state.midi.mapping,
})

const mapDispatchToProps = dispatch => ({
    updatePort : (port) => dispatch(setMidiPort(port)),
    setMidiMappingMode: (value) => dispatch(setMidiMappingState(value)),
    setCurrentProfile : (id) => dispatch(setCurrentMidiProfile(id)),
    createMidiProfile : name => dispatch(reqCreateMidiProfile(name)),
    deleteMidiProfile: () => dispatch(reqDeleteMidiProfile()),

    setKbdMappingMode: () => console.log("kbd mapping mode not implemented"),
    createKbdProfile: () => console.log("create midi profile, im not implemented"),
    deleteKbdProfile: () => console.log("delete kbd profile,  im not implemented")
})

export default connect(mapStateToProps, mapDispatchToProps)(ControlMenu);