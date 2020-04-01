import { ACTIONS } from "./../actions";
import { produce } from "imer";

const deck = {
    track: {
        title: "",
        bpm: 0,
        quality: "",
        duration: "",
        source: "",
        id: "",
        thumbnail: {}
    }, // 
    playBackState: {
        ready: false,
        loadingProgress: 0,
        paused: true,
        cuePoint: 0,
        cueActive: false,
        pitch: 0,
        timeLeft: null,
        offset: null,
        sync: false,
        loop: false,
    },
    deckState: {
        loopLength: -1,
    }
}


const initState = {
    master: null,//A, B ....
    channel: {
        A: {
            ...deck
        },
        B: {
            ...deck
        }
    },
}

function nextState(part) {
    return (state, destination, haveToBeReady, variables) => {

        if (!state.channel[destination]) return state;
        if (haveToBeReady && !state.channel[destination].playBackState.ready) return state;

        const nextState = produce(state, (draftState) => {
            for (let [variable, value] of Object.entries(variables)) {
                switch (part) {
                    case "playBackState": {
                        draftState.channel[destination].playBackState[variable] = value;
                        break;
                    }
                    case "track": {
                        draftState.channel[destination].track[variable] = value;
                        break;
                    }
                    case "deckState": {
                        draftState.channel[destination].deckState[variable] = value;
                        break;
                    }
                    default: break;
                }
            }
        })

        return nextState;
    }
}

const nextPlayBackState = nextState('playBackState');
const nextTrackState = nextState('track');
const nextDeckState = nextState('deckState');



function consoleReducer(state = initState, action) {
    switch (action.type) {
        case ACTIONS.LOAD_TRACK: {
            const nextTrack = action.track;
            if (state.channel[action.destination].track._id === nextTrack._id) {
                return state;
            }
            return produce(state, draftState => {
                draftState.channel[action.destination].track = {
                    title: nextTrack.title,
                    bpm: nextTrack.bpm || 0,
                    quality: nextTrack.quality,
                    duration: nextTrack.duration,
                    source: nextTrack.source,
                    id: nextTrack.id,
                    _id: nextTrack._id,
                    thumbnail: nextTrack.thumbnail,
                }
                //reseting  play back state
                draftState.channel[action.destination].playBackState = {
                    ...initState.channel[action.destination].playBackState,
                    offset: nextTrack.offset,
                    loopLength: state.channel[action.destination].playBackState.loopLength,
                }
            })
        }

        case ACTIONS.SET_LOADING_PROGRESS: {
            return nextPlayBackState(state, action.destination, false, { loadingProgress: action.value })
        }

        case ACTIONS.SET_READY: {
            return nextPlayBackState(state, action.destination, false, { ready: action.value })
        }

        case ACTIONS.SET_PITCH: {
            return nextPlayBackState(state, action.destination, false, { pitch: action.pitch })
        }

        case ACTIONS.INCREASE_PITCH: {
            let prevPitch = state.channel[action.destination]?.playBackState?.pitch;
            if (prevPitch === undefined) return state;
            return nextPlayBackState(state, action.destination, false, { pitch: prevPitch + action.amount })
        }

        case ACTIONS.DECREASE_PITCH: {
            let prevPitch = state.channel[action.destination]?.playBackState?.pitch;
            if (prevPitch === undefined) return state;
            return nextPlayBackState(state, action.destination, false, { pitch: prevPitch - action.amount })
        }


        case ACTIONS.TOGGLE_PLAY: {
            let prevPause = state.channel[action.destination]?.playBackState?.paused;
            prevPause = (prevPause === undefined) ? true : prevPause;
            return nextPlayBackState(state, action.destination, true, { paused: !prevPause })
        }

        case ACTIONS.SET_TIME_LEFT: {
            return nextPlayBackState(state, action.destination, true, { timeLeft: action.timeLeft })
        }

        case ACTIONS.TOGGLE_CUE: {
            let prevCue = state.channel[action.destination]?.playBackState?.cueActive;
            prevCue = (prevCue === undefined) ? false : prevCue;
            return nextPlayBackState(state, action.destination, true, { cueActive: !prevCue })
        }

        case ACTIONS.CANCEL_CUE_AND_PLAY: {
            return nextPlayBackState(state, action.destination, true, {
                cueActive: false,
                paused: false,
            })
        }

        case ACTIONS.SET_CUE_POINT: {
            return nextPlayBackState(state, action.destination, true, { cuePoint: action.position })
        }


        case ACTIONS.SET_MASTER: {
            const nextMaster = (action.destination === state.master)
                ? ""
                : action.destination;
            return produce(state, draftState => draftState.master = nextMaster)
        }

        case ACTIONS.TOGGLE_SYNC: {
            let prevSync = state.channel[action.destination]?.playBackState?.sync;
            prevSync = (prevSync === undefined) ? false : prevSync;
            let offset = state.channel[action.destination]?.playBackState?.offset;
            if (!offset && !prevSync) return state// can't turn on sync if offset is not calculated 
            return nextPlayBackState(state, action.destination, true, { sync: !prevSync })
        }

        case ACTIONS.SET_SYNC: {
            let offset = state.channel[action.destination]?.playBackState?.offset;
            if (!offset) return state;// can't turn on sync if offset is not calculated 
            return nextPlayBackState(state, action.destination, true, { sync: action.value });
        }


        case ACTIONS.SET_BPM_AND_OFFSET: {
            let channels = [];
            for (let channelName of Object.keys(state.channel)) {
                if (state.channel[channelName].track._id === action.id) {
                    channels.push(channelName);
                }
            }
            if (channels.length === 0) return state;

            return channels.reduce((prevState, channelName) => {
                let trackState = nextTrackState(prevState, channelName, false, { bpm: action.bpm });
                return nextPlayBackState(trackState, channelName, false, { offset: action.offset })
            }, state);
        }

        case ACTIONS.SET_LOOP: {
            const paused = state.channel[action.destination].playBackState.paused;
            const bpm = state.channel[action.destination].track.bpm;
            const offset = state.channel[action.destination].playBackState.offset;

            let newValue = action.value;
            if (paused || !bpm || offset === null) {
                newValue = false;
            }
            return nextPlayBackState(state, action.destination, true, { loop: newValue });
        }


        case ACTIONS.SET_LOOP_LENGTH: {
            return nextDeckState(state, action.destination, false, { loopLength: action.value });
        }


        default: return state;
    }
}

export default consoleReducer;


