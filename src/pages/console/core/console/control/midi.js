import {MAPPING, setMidiMapValue} from "./../../../../../actions"
import store from "./../../../../../store";
import MidiTranslator from "./MidiTranslator/midiTranslator";
import _throttle from "lodash/throttle";
import STATUS from "./MidiTranslator/midiStatus";

const selectMappingMode = state => state.midi.mapping;
const selectProfileMap = state => {
    const currentId = state.midi.currentProfileId;
    return state.midi.profiles[currentId].map;
}
const selectActions = state => state.midi.actions;

export default class MidiController {
    constructor() {
        this.midiTranslator = new MidiTranslator();

        this.setMidiMap = _throttle(
            (msg) => store.dispatch(setMidiMapValue(msg))
            , 100)
        this.throtles = new Map();
        this.midiIn = this.onMidiIn.bind(this)
    }


    updateMidiPort(port){
        if(this.currentPort){
            this.currentPort.onmidimessage = this.midiIn;
        }
        port.onmidimessage = this.midiIn;
        this.currentPort = port;
    }

    onMidiIn(message){
        const state = store.getState()
        const msg = this.midiTranslator.translate(message.data);
        const mappingMode = selectMappingMode(state);
        if(mappingMode){
            this.setMidiMap(msg)
            return;
        }

        let action = this._getAction(state, msg.id);
        if(!action) return;

        if(msg.name === STATUS.NOTE_ON && msg.velocity === 0) {
            store.dispatch(action());
            return;
        }

        let value = null;

        if(msg.min){
            value = "0%";
        } else if(msg.max){
            value = "100%";
        } else if(msg.increment){
            value = "+" + (msg.increment / 127 / 2) * 100 + "%";
        } else if(msg.decrement){
            value = "-" + (msg.decrement / 127 / 2) * 100 + "%";
        } else if(msg.value !== undefined){
            value = (msg.value / 127 ) * 100 + "%";
        }

        // skipping multiple times calling min or max value
        if(["0%", "100%"].includes(this.last) && this.last === value) return;
        this.last = value;
        //

        if(typeof action !== "function") return;
        store.dispatch(action(value))
    }

    _getAction(state, midiId){
        if(!state) {
            state = store.getState();
        }
        const map = selectProfileMap(state);
        const actionId = map.toAction[midiId];
        const actions = selectActions(state);
        if(!actions[actionId]) return null;
        return MAPPING[actions[actionId].fullName].action;
    }
}