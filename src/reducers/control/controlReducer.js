import {ACTIONS, MAPPING} from "./../../actions";
import {produce} from "imer";
import _omitBy from "lodash/omitBy";

const initState = {
    port: null,
    mapping: false,
    currentMapping: null,
    profileList : [{id: 123, type : "midi", name: "Profile 1"}, {id: 321, type:"midi", name: "Profile 2"}, {id: 456, type:"kbd", name: "Profile 54"}],
    currentMidiProfileId : 123,
    currentKbdProfileId: 456,
    actions : (()=>{
        const _actions = {};
        for(let key in MAPPING){
            if(!MAPPING.hasOwnProperty(key)) continue;
            _actions[MAPPING[key].id] = {
                id : MAPPING[key].id,
                descriptions: MAPPING[key].description,
                fullName : key,
            }
        }
        return _actions;
    })(),

    profiles : {
        123: {
            id: 456454,
            name : "Profile 1",
            type: "midi",
            map : {
                toAction : {},
                toMidi : {}
            }
        },
        456: {
            id: 456,
            name : "Profile 56",
            type: "kbd",
            map : {
                toAction : {},
                toMidi : {}
            }
        }
    }
}


export default function controlReducer(state  = initState, action){

    switch (action.type){
        case ACTIONS.CONTROL_SET_MIDI_PORT : {
            return {
                ...state,
                port: action.port,
            };
        }

        case ACTIONS.CONTROL_SET_MAPPING_STATE : {
            return {
                ...state,
                mapping: action.value,
            }
        }

        case ACTIONS.CONTROL_SET_MAPPING_ACTION : {
            return {
                ...state,
                currentMapping: action.element,
            }
        }

        case ACTIONS.CONTROL_SET_MIDI_MAPPING_VALUE : {
            if(!state.currentMapping) return state;
            const {midiMsg} = action;
            return produce(state, draftState => {
                const profile = state.profiles[state.currentMidiProfileId];
                const toAction = _omitBy(profile.map.toAction, ( value, key) =>
                      ((key === midiMsg.id) || (value === state.currentMapping.id))
                    )

                const toMidi = _omitBy(profile.map.toMidi, (value, key) =>
                        ((value === midiMsg.id) || (key === state.currentMapping.id))
                    )
                toAction[midiMsg.id] = state.currentMapping.id;
                toMidi[state.currentMapping.id] = midiMsg.id;
                draftState.profiles[state.currentMidiProfileId].map = {toAction, toMidi};
            })
        }

        case ACTIONS.CONTROL_SET_KBD_MAPPING_VALUE : {
            if(!state.currentMapping) return state;
            const {keyId} = action;
            const currentMappingKey = state.currentMapping.id +"-"+ state.currentMapping.method
            return produce(state, draftState => {
                const profile = state.profiles[state.currentKbdProfileId];
                const toAction = _omitBy(profile.map.toAction, ( value, key) =>
                    ((key === keyId) || (value === currentMappingKey))
                )

                const toKbd = _omitBy(profile.map.toKbd, (value, key) =>
                    ((value === keyId) || (key === currentMappingKey))
                )
                toAction[keyId] = currentMappingKey ;
                toKbd[currentMappingKey] = keyId;
                draftState.profiles[state.currentKbdProfileId].map = {toAction, toKbd};
            })
        }


        case ACTIONS.CONTROL_SET_CURRENT_PROFILE : {
            const {profileId, profileType} = action;
            const data = {}
            if(profileType === "midi"){
                data.currentMidiProfileId = profileId;
            } else {
                data.currentKbdProfileId = profileId
            }
            return {
                ...state,
                ...data,
            }
        }


        ///CRUD - CSUD to be more explicit
        case ACTIONS.CONTROL_CREATE_PROFILE :{
            console.log(action)
            const {profile} = action;
            return {
                ...state,
                profiles: {
                    ...state.profiles,
                    [profile.id]: {
                        ...profile,
                        map: {toMidi: {}, toAction:{}}
                    }
                },
                profileList: [
                    ...state.profileList,
                    profile
                ],
                currentProfileId: profile.id,
            }
        }

        case ACTIONS.CONTROL_SET_PROFILE:
        case ACTIONS.CONTROL_UPDATE_PROFILE: {
            const {profile} = action;
            return {
                ...state,
                profiles: state.profiles.map( p => {
                    if(p.id === profile.id){
                        p = {
                            ...p,
                            ...profile
                        }
                    }
                    return p;
                })
            }
        }

        case ACTIONS.CONTROL_DELETE_PROFILE:{
            const {profile} = action;
            return {
                ...state,
                profiles: state.profiles.filter( p => p.id !== profile.id),
                profileList: state.profileList.filter( p => p.id !== profile.id),
            }
        }

        default: return state;
    }
}