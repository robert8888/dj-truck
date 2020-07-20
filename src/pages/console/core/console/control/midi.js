import {MAPPING, setMidiMapValue} from "./../../../../../actions"
import store from "./../../../../../store";
import MidiTranslator from "./MidiTranslator/midiTranslator";
import _throttle from "lodash/throttle";
import STATUS from "./MidiTranslator/midiStatus";
import Controller from "./controller";


export default class MidiController extends Controller{
    constructor() {
        super("midi")
        this.midiTranslator = new MidiTranslator();
    }

    updateMidiPort(port){
        if(this.currentPort){
            this.currentPort.onmidimessage = null;
        }
        port.onmidimessage = this.onMidiIn.bind(this);
        this.currentPort = port;
    }

    onMidiIn(message){
        const msg = this.midiTranslator.translate(message.data);
        const mappingMode = this._getMappingMode();
        if(mappingMode === "midi"){
            this.commit(setMidiMapValue(msg))
            return;
        }

        let action = this._getAction(msg.id)?.reference;
        if(!action) return;

        if(msg.name === STATUS.NOTE_ON && msg.velocity === 0) {
            this.commit(action())
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
        this.commit(action(value))
    }

}