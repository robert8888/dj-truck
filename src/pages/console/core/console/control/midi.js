import * as JZZ from "jzz";
import {setMidiMapValue} from "./../../../../../actions"
import store from "./../../../../../store";
import MidiTranslator from "./MidiTranslator/midiTranslator";
import _throttle from "lodash/throttle";

const selectMappingMode = state => state.midi.mapping;

export default class MidiController {
    constructor() {
        this.engine = JZZ();
        this.midiTranslator = new MidiTranslator();

        this.setMidiMap = _throttle(
            (msg) => store.dispatch(setMidiMapValue(msg))
            , 100)
    }

    updateMidiPort(port){
        this.engine.openMidiIn(port.name)
            .then(port => port.connect(this.onMidiIn.bind(this)))
    }

    onMidiIn(_msg){
        const msg = this.midiTranslator.translate(_msg);
        const mappingMode = selectMappingMode(store.getState());
        if(mappingMode){
            this.setMidiMap(msg)
        }

    }
}