import { ACTIONS } from "./../../../actions";
import STATES from "./stateDef";

const initState = {
    recName: "",
    recId: null,
    recordingState: STATES.IDLE,
    startTime: null,
    tracklist: [],
}

export default function headerState(state = initState, action) {
    switch (action.type) {
        case ACTIONS.R_START_RECORDING: {
            return {
                ...state,
                recordingState: STATES.INIT,
                recName: action.recName,
                recId: action.id,
                startTime: new Date().getTime(),
                tracklist : action.initTracklist
            }
        }

        case ACTIONS.R_END_RECORDING: {
            return {
                ...state,
                recordingState: STATES.IDLE,
                recName: "",
            }
        }

        case ACTIONS.R_RECORDING: {
            return {
                ...state,
                recordingState: STATES.RECORDING,
            }
        }

        case ACTIONS.R_RECORDING_FAIL: {
            return {
                ...state,
                recordingState: STATES.FAIL,
                recName: "",
                tracklist: []
            }
        }

        case ACTIONS.R_PUSH_TO_TRACKLIST: {
            const tracklist = Array.from(state.tracklist);
            tracklist.push(action.track);
            return {
                ...state,
                tracklist : tracklist
            }
        }

        case ACTIONS.R_UPDATE_START:{
            const {id} = action;
            const tracklist = state.tracklist.map((track) => {
                if(track.id === id && !track.start){
                    track.start = (new Date().getTime() - state.startTime) / 1000;
                }
                return track;
            })
            return {
                ...state,
                tracklist,
            }
        }

        case ACTIONS.R_UPDATE_END:{
            const {id} = action;
            const tracklist = state.tracklist.map((track) => {
                if(track.id === id && !track.end){
                    track.end =  (new Date().getTime() - state.startTime) / 1000;
                }
                return track;
            })
            return {
                ...state,
                tracklist,
            }
        }


        default: return state;
    }
}