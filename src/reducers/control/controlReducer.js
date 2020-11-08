import {ACTIONS, MAPPING} from "./../../actions";
import {produce} from "imer";
import _omitBy from "lodash/omitBy";

const initState = {
    port: null,
    mapping: false,
    currentMapping: null,
    profileList : [],//[{type: "midi", name:"midid test", id : 50}],
    currentMidiProfileId : 50,
    currentKbdProfileId: null,
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
        // 50 : {
        //     map: {
        //         toMidi : {
        //             "MCEL_A"  : "CH:4-PW"
        //
        //         },
        //         toAction: {
        //             "CH:4-PW" : "MCEL_A"
        //         }
        //     }
        // }
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


        case ACTIONS.CONTROL_SET_PROFILE_LIST :{
            const {profileList} = action;
            return {
                ...state,
                profileList,
            }
        }


        ///CRUD - CSUD to be more explicit
        case ACTIONS.CONTROL_CREATE_PROFILE :{
            console.log("create profile", action)
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

        case ACTIONS.CONTROL_SET_PROFILE: {
            const {profile} = action;
            const profiles = state.profiles;
            const map = {}
            map.toAction = {};

            if(profile.type  === "midi"){
                map.toMidi = {};
            } else if(profile.type === "kbd"){
                map.toKbd = {};
            }

            profile.map.forEach(item => {
                if(profile.type  === "midi"){
                    map.toMidi[item.value] = item.key;
                } else if(profile.type === "kbd"){
                    map.toKbd[item.value] = item.key;
                }
                map.toAction[item.key] = item.value;
            })

            profiles[profile.id] = {
                ...profile,
                map,
            }
            const draftState = {
                ...state,
                profiles,
            }
            if(profile.type === "midi"){
                draftState.currentMidiProfileId = profile.id;
                localStorage.setItem("currentMidiProfileId",  profile.id);
            } else if(profile.type === "kbd"){
                draftState.currentKbdProfileId = profile.id;
                localStorage.setItem("currentKbdProfileId", profile.id);
            }
            return draftState;

        }
        case ACTIONS.CONTROL_UPDATE_PROFILE: {
            const {profile} = action;
            const profiles = state.profiles;
            profiles[profile.id] = {
                ...profiles[profile.id],
                ...profile,
            }
            const profileList = state.profileList.map(p => {
                if(p.id === profile.id){
                    p = {...p, ...profile}
                }
                return p
            })

            return {
                ...state,
                profiles,
                profileList,
            }
        }

        case ACTIONS.CONTROL_DELETE_PROFILE:{
            const {profile} = action;
            const profiles = state.profiles;
            delete profiles[profile.id];
            if(profile.type === "midi"){
                localStorage.removeItem("currentMidiProfileId")
            } else if(profile.type === "kbd"){
                localStorage.removeItem("currentKbdProfileId")
            }

            return {
                ...state,
                profiles,
                profileList: state.profileList.filter( p => p.id !== profile.id),
            }
        }

        default: return state;
    }
}