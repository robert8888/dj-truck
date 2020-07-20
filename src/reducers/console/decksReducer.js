import { produce } from "imer";
import { ACTIONS } from "./../../actions";
import _set from "lodash/set";
import {toRange} from "../../utils/math/argRanges";
import {evalValue} from "./utils/evalMidiValue";

const initDeckState = {
    track: {
        title: "",
        bpm: 0,
        offset: 0,
        quality: "",
        duration: "",
        source: "",
        sourceId: "",
        id: "",
        thumbnail: {}
    }, // 
    playBackState: {
        ready: false,
        loadingProgress: 0,
        paused: true,
        cuePoint: 0,
        cueActive: false,
        pitch: {
            min: -8,
            max: 8,
            default: 0,
            current: 0,
        },
        timeLeft: null,
        offset: null, // move this to track now is in both
        sync: false,
        loop: false,
    },
    deckState: {
        loopLengths : (()=>{
            const lengths = []
            for (let i = 1 / 64; i <= 64; i = i * 2) {
               lengths.push(i);
            }
            return lengths;
        })(),
        loopLength: {
            default : 4,
            min: 0,
            max: 12,
            current: 8,
        },
        inKey: false,
    }
}


const initState = {
    master: null,//A, B ....
    channel: {
        A: {
            ...initDeckState
        },
        B: {
            ...initDeckState
        }
    },
}

function nextState(part) {
    return (state, destination, haveToBeReady, variables, depth) => {

        if (!state.channel[destination]) return state;
        if (haveToBeReady && !state.channel[destination].playBackState.ready) return state;

        const base = ["channel", destination, part]

        const nextState = produce(state, (draftState) => {
            for (let [variable, value] of Object.entries(variables)) {
                const path = [...base, variable];
                if(depth){
                    path.push("current")
                }
                _set(draftState, path, value);
            }
        })
        return nextState;
    }
}

const nextPlayBackState = nextState('playBackState');
const nextTrackState = nextState('track');
const nextDeckState = nextState('deckState');

//this is easies way to keep
//some value between reducer calling
//is used to store not integer value of loop length
//in case increasing it value by cc midi signal
const temp = {
    floatLoopLength: null
}

function consoleReducer(state = initState, action) {
    switch (action.type) {
        case ACTIONS.CONSOLE_RESET : {
            let channels = Object.keys(state.channel);
            return produce(state, draftState=>{
                for(let channel of channels){
                    draftState.channel[channel].playBackState = initDeckState.playBackState;
                    draftState.channel[channel].track = initDeckState.track;
                }
            })
        }

        case ACTIONS.LOAD_TRACK: {
            const nextTrack = action.track;
            if (state.channel[action.destination].track.id === nextTrack.id) {
                return state;
            }
            return produce(state, draftState => {
                draftState.channel[action.destination].track = {
                    title: nextTrack.title,
                    bpm: nextTrack.bpm || 0,
                    offset: nextTrack.offset,
                    quality: nextTrack.quality,
                    duration: nextTrack.duration,
                    source: nextTrack.source,
                    id: nextTrack.id,
                    sourceId: nextTrack.sourceId,
                    thumbnails: nextTrack.thumbnails,
                }
                //reset  play back state
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
            let {pitch : value, destination} = action;
            if(value === null || value === undefined) return state;
            const min = state.channel[destination].playBackState.pitch.min;
            const max = state.channel[destination].playBackState.pitch.max;
            const current = state.channel[destination].playBackState.pitch.current;
            if(typeof value === "string"){
                value = evalValue(value, min,  max, current)
            }
            value = toRange(value, min, max);
            return nextPlayBackState(state, destination, false, { pitch: value }, true)
        }

        case ACTIONS.INCREASE_PITCH: {
            let prevPitch = state.channel[action.destination]?.playBackState?.pitch.current;
            if (prevPitch === undefined) return state;
            return nextPlayBackState(state, action.destination, false, { pitch: prevPitch + action.amount }, true)
        }

        case ACTIONS.DECREASE_PITCH: {
            let prevPitch = state.channel[action.destination]?.playBackState?.pitch.current;
            if (prevPitch === undefined) return state;
            return nextPlayBackState(state, action.destination, false, { pitch: prevPitch - action.amount }, true)
        }


        case ACTIONS.TOGGLE_PLAY: {
            const {value} = action;
            if(value === undefined) return state;
            if(typeof value === "string" &&
               (value.match(/^[+-]/) || ![0,100].includes(parseInt(value)))) {
                return state;
            }

            let prevPause = state.channel[action.destination]?.playBackState?.paused;
            prevPause = (prevPause === undefined) ? true : prevPause;
            return nextPlayBackState(state, action.destination, true, { paused: !prevPause })
        }


        case ACTIONS.TOGGLE_CUE: {
            const {value} = action;
            if(typeof  value === "string") return;
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
            const {value} = action;
            if(value === undefined ||
              (value && value.match(/^[+-]/))||
              (typeof value === "string" && ![0, 100].includes(parseInt(value)))) {
                return state;
            }
            const nextMaster = (action.destination === state.master)
                ? ""
                : action.destination;
            return produce(state, draftState => draftState.master = nextMaster)
        }

        case ACTIONS.TOGGLE_SYNC: {
            const {value} = action;
            if(value === undefined) return state;

            let prevSync = state.channel[action.destination]?.playBackState?.sync;
            prevSync = (prevSync === undefined) ? false : prevSync;
            let offset = state.channel[action.destination]?.playBackState?.offset;
            if (!offset && !prevSync) return state// can't turn on sync if offset is not calculated 

            return nextPlayBackState(state, action.destination, true, { sync: !prevSync })
        }

        case ACTIONS.SET_SYNC: {
            const {value} = action;
            if(value === undefined || value === null) return state;
            let offset = state.channel[action.destination]?.playBackState?.offset;
            if (!offset) return state;// can't turn on sync if offset is not calculated 
            return nextPlayBackState(state, action.destination, true, { sync: action.value });
        }


        case ACTIONS.PL_SET_BPM_AND_OFFSET: {
            if(action.bpm === undefined || action.bpm === null ||
               action.offset === undefined || action.offset === null){
                return state;
            }
            let channels = [];
            for (let channelName of Object.keys(state.channel)) {
                if (state.channel[channelName].track.id === action.id) {
                    channels.push(channelName);
                }
            }
            if (channels.length === 0) return state;

            return channels.reduce((prevState, channelName) => {
                let trackState = nextTrackState(prevState, channelName, false, { bpm: action.bpm, offset:action.offset });
                return nextPlayBackState(trackState, channelName, false, { offset: action.offset })
            }, state);
        }

        //---------------lo oo ops

        case ACTIONS.SET_LOOP: {
            let {value} = action;
            if(value === undefined ||
                (typeof value === "string" && value.match(/^[+-]/))) {
                return state;
            }
            if(typeof value === "string"){
                value = parseInt(value);
                if(![0,100].includes(value))return state;
                value = !!value;
            }
            if(value === null){
                value = !state.channel[action.destination].playBackState.loop;
            }
            const paused = state.channel[action.destination].playBackState.paused;
            const bpm = state.channel[action.destination].track.bpm;
            const offset = state.channel[action.destination].playBackState.offset;

            let newValue = value;
            if (paused || !bpm || offset === null) {
                newValue = false;
            }
            return nextPlayBackState(state, action.destination, true, { loop: newValue });
        }

        case ACTIONS.SET_IN_KEY: {
            const {value, destination} = action;
            if(!destination || value === undefined || value === null){
                return state;
            }
            return nextDeckState(state, destination, false, {inKey: value} )
        }


        case ACTIONS.SET_LOOP_LENGTH: {
            let {value} = action;
            if(value === undefined) return state;

            const min = state.channel[action.destination].deckState.loopLength.min;
            const max = state.channel[action.destination].deckState.loopLength.max;
            const current = state.channel[action.destination].deckState.loopLength.current;

            if(value === null){
                value = (current + 1) % max;
            }
            if(typeof value === "string"){
                if(value.match(/^[+-]/)){
                    let diff = parseFloat(value.substr(1));
                    if(diff >= 10){
                        temp.floatLoopLength += (value.startsWith("+")) ? 1 : -1;
                    } else {
                        diff = (max - min) * (diff /100);
                        temp.floatLoopLength += (value.startsWith("+")) ? diff : -diff;
                    }
                    temp.floatLoopLength = toRange(temp.floatLoopLength, min, max);
                    value = parseInt(temp.floatLoopLength)
                } else {
                    value = parseInt(parseInt(value) * (max - min) /100) + min;
                    temp.floatLoopLength = value;
                }
            } else {
                temp.floatLoopLength = value;
            }
            console.log(value)
            return nextDeckState(state, action.destination, false, { loopLength: value }, true);
        }


        default: return state;
    }
}

export default consoleReducer;


