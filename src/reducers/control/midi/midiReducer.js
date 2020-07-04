import {ACTIONS, MAPPING} from "./../../../actions";

const initState = {
    port: localStorage.getItem("midiPort"),
    mapping: false,
    currentMapping: null,
    profileList : [{id: 123, name: "Profile 1"}, {id: 321, name: "Profile 2"}],
    currentProfileId : 123,
    profiles : [
        {
            id: 456454,
            name : "Profile 1",
            map : [
                {
                    action: MAPPING.MIXER_CHANNEL_RESONANCE(1),
                    midi: null,
                }
            ]
        }
    ]


}


export default function midiReducer(state  = initState, action){

    switch (action.type){
        case ACTIONS.C_MIDI_SET_PORT : {
            localStorage.setItem("midiPort", action.port);
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

        case ACTIONS.C_MIDI_SET_MAPPING_CURRENT : {
            return {
                ...state,
                currentMapping: action.element,

            }
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
                profiles: [
                    ...state.profiles,{
                        ...profile,
                        map: []
                    }
                ],
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
                        p = profile;
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