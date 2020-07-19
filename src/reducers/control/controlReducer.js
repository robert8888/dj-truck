import {ACTIONS, MAPPING} from "./../../../actions";
import {produce} from "imer";
import _omitBy from "lodash/omitBy";

const initState = {
    port: null,
    mapping: false,
    currentMapping: null,
    profileList : [{id: 123, name: "Profile 1"}, {id: 321, name: "Profile 2"}],
    currentProfileId : 123,
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
            map : {
                toAction : {},
                toMidi : {}
            }
        }
    }
}


export default function midiReducer(state  = initState, action){

    switch (action.type){
        case ACTIONS.C_MIDI_SET_PORT : {
            return {
                ...state,
                port: action.port,
            };
        }

        case ACTIONS.C_MIDI_SET_MAPPING_STATE : {
            return {
                ...state,
                mapping: action.value,
            }
        }

        case ACTIONS.C_MIDI_SET_MAPPING_ACTION : {
            return {
                ...state,
                currentMapping: action.element,
            }
        }

        case ACTIONS.C_MIDI_SET_MAPPING_VALUE : {
            if(!state.currentMapping) return state;
            const {midiMsg} = action;
            return produce(state, draftState => {
                const profile = state.profiles[state.currentProfileId];
                const toAction = _omitBy(profile.map.toAction, ( value, key) =>
                      ((key === midiMsg.id) || (value === state.currentMapping.id))
                    )

                const toMidi = _omitBy(profile.map.toMidi, (value, key) =>
                        ((value === midiMsg.id) || (key === state.currentMapping.id))
                    )
                toAction[midiMsg.id] = state.currentMapping.id;
                toMidi[state.currentMapping.id] = midiMsg.id;
                draftState.profiles[state.currentProfileId].map = {toAction, toMidi};
            })
        }

        case ACTIONS.C_MIDI_SET_CURRENT_PROFILE : {
            return {
                ...state,
                currentProfileId: action.profileId
            }
        }


        ///CRUD - CSUD to be more explicit
        case ACTIONS.C_MIDI_CREATE_PROFILE :{
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

        case ACTIONS.C_MIDI_SET_PROFILE:
        case ACTIONS.C_MIDI_UPDATE_PROFILE: {
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

        case ACTIONS.C_MIDI_DELETE_PROFILE:{
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