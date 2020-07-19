
//--------- Serching----------------

const ACTIONS = {
    C_MIDI_SET_PORT : "Set current mini in port",

    C_MIDI_SET_MAPPING_STATE: "Set is in mapping mode state",
    C_MIDI_SET_MAPPING_ACTION: "Set current midi mapping element",
    C_MIDI_SET_MAPPING_VALUE: "Set midi value to current mapped action",

    // ----
    C_MIDI_REQ_CREATE_PROFILE: "Create midi profile",
    C_MIDI_CREATE_PROFILE: "Create new midi profiles",

    C_MIDI_REQ_PROFILE: "Request for midi profile",
    C_MIDI_SET_PROFILE: "Set profile configuration",

    C_MIDI_REQ_UPDATE_PROFILE: "Request for update current profile",
    C_MIDI_UPDATE_PROFILE : "Update midi profile",

    C_MIDI_REQ_DELETE_PROFILE: "Request delete current selected profile",
    C_MIDI_DELETE_PROFILE: "Delete current selected profile",
    //-----

    C_MIDI_REQ_PROFILE_LIST: "Request for current user profile list",
    C_MIDI_SET_PROFILE_LIST: "Set user profile list",

    C_MIDI_SET_CURRENT_PROFILE: "Set current midi profile",//
}

export { ACTIONS as CONTROL_MIDI_ACTIONS };

//------ profile editions

export function setMidiPort(port){
    return { type: ACTIONS.C_MIDI_SET_PORT, port}
}

export function setMidiMappingState(value){
    return { type: ACTIONS.C_MIDI_SET_MAPPING_STATE, value}
}

export function setMidiCurrentMapping(element){
    return { type: ACTIONS.C_MIDI_SET_MAPPING_ACTION, element}
}

export function setMidiMapValue(midiMsg){
    return { type: ACTIONS.C_MIDI_SET_MAPPING_VALUE, midiMsg}
}


// ----- CRUD Profile
export function reqCreateMidiProfile(name){
    return {type: ACTIONS.C_MIDI_REQ_CREATE_PROFILE, name}
}

export function createMidiProfile(profile){
    return {type: ACTIONS.C_MIDI_CREATE_PROFILE, profile}
}

export function reqMidiProfile(id){
    return {type: ACTIONS.C_MIDI_REQ_PROFILE, id}
}

export function setMidiProfile(profile){
    return {type: ACTIONS.C_MIDI_SET_PROFILE, profile}
}

export function reqUpdateMidiProfile(profile){
    return {type: ACTIONS.C_MIDI_UPDATE_PROFILE, profile}
}

export function updateMidiProfile(profile){
    return {type: ACTIONS.C_MIDI_UPDATE_PROFILE, profile}
}

export function reqDeleteMidiProfile(profile){
    return {type: ACTIONS.C_MIDI_REQ_DELETE_PROFILE, profile}
}

export function deleteMidiProfile(profile){
    return {type: ACTIONS.C_MIDI_DELETE_PROFILE, profile}
}

//------ profile list


export function reqMidiProfileList(){
    return {type: ACTIONS.C_MIDI_REQ_PROFILE_LIST}
}

export function setMidiProfileList(list){
    return {type: ACTIONS.C_MIDI_SET_PROFILE_LIST, list}
}
//-------- current profile

export function setCurrentMidiProfile(profileId){
    return { type: ACTIONS.C_MIDI_SET_CURRENT_PROFILE, profileId}
}
