
//--------- Serching----------------

const ACTIONS = {
    CONTROL_SET_MIDI_PORT : "Set current mini in port",

    CONTROL_SET_MAPPING_STATE: "Set is in mapping mode state",
    CONTROL_SET_MAPPING_ACTION: "Set current midi mapping element",
    CONTROL_SET_MIDI_MAPPING_VALUE: "Set midi value to current mapped action",
    CONTROL_SET_KBD_MAPPING_VALUE: "Set kbd value to current mapped action",

    // ----
    CONTROL_REQ_CREATE_PROFILE: "Create control profile",
    CONTROL_CREATE_PROFILE: "Create new control profiles",

    CONTROL_REQ_PROFILE: "Request for control profile",
    CONTROL_SET_PROFILE: "Set profile configuration",

    CONTROL_REQ_UPDATE_PROFILE: "Request for update current control profile",
    CONTROL_UPDATE_PROFILE : "Update control profile",

    CONTROL_REQ_DELETE_PROFILE: "Request delete current selected control profile",
    CONTROL_DELETE_PROFILE: "Delete current selected  control profile",
    //-----

    CONTROL_REQ_PROFILE_LIST: "Request for current user control profile list",
    CONTROL_SET_PROFILE_LIST: "Set user control profile list",

    CONTROL_REQ_CURRENT_PROFILE: "Request for profile map by id",
    CONTROL_SET_CURRENT_PROFILE: "Set current control profile",//
}

export { ACTIONS as CONTROL_ACTIONS };

//------ profile editions

export function setMidiPort(port){
    return { type: ACTIONS.CONTROL_SET_MIDI_PORT, port}
}

export function setMappingState(value){
    return { type: ACTIONS.CONTROL_SET_MAPPING_STATE, value}
}

export function setCurrentMapping(element){
    return { type: ACTIONS.CONTROL_SET_MAPPING_ACTION, element}
}

export function setMidiMapValue(midiMsg){
    return { type: ACTIONS.CONTROL_SET_MIDI_MAPPING_VALUE, midiMsg}
}

export function setKbdMapValue(keyId){
    return {type: ACTIONS.CONTROL_SET_KBD_MAPPING_VALUE, keyId}
}

// ----- CRUD Profile
export function reqCreateControlProfile(name, profileType){
    return {type: ACTIONS.CONTROL_REQ_CREATE_PROFILE, name, profileType}
}

export function createControlProfile(profile){
    return {type: ACTIONS.CONTROL_CREATE_PROFILE, profile}
}

export function reqControlProfile(id){
    return {type: ACTIONS.CONTROL_REQ_PROFILE, id}
}

export function setControlProfile(profile){
    return {type: ACTIONS.CONTROL_SET_PROFILE, profile}
}

export function reqUpdateControlProfile(profile){
    return {type: ACTIONS.CONTROL_REQ_UPDATE_PROFILE, profile}
}

export function updateControlProfile(profile){
    return {type: ACTIONS.CONTROL_UPDATE_PROFILE, profile}
}

export function reqDeleteControlProfile(profile){
    return {type: ACTIONS.CONTROL_REQ_DELETE_PROFILE, profile}
}

export function deleteControlProfile(profile){
    return {type: ACTIONS.CONTROL_DELETE_PROFILE, profile}
}

//------ profile list


export function reqControlProfileList(){
    return {type: ACTIONS.CONTROL_REQ_PROFILE_LIST}
}

export function setControlProfileList(profileList){
    return {type: ACTIONS.CONTROL_SET_PROFILE_LIST, profileList}
}
//-------- current profile

// export function reqCurrentControlProfile(profileId){
//     return {type: ACTIONS.CONTROL_REQ_CURRENT_PROFILE, profileId};
// }

export function setCurrentControlProfile(profileId, profileType){
    return { type: ACTIONS.CONTROL_SET_CURRENT_PROFILE, profileId, profileType}
}
