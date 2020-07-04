import * as JZZ from "jzz"
import store from "./../../../../../store";

export default class MidiController {
    constructor() {
        this.engine = JZZ();
    }

    updateMidiPort(port){
        console.log("new port is set", port)
        this.engine.openMidiIn(port.name)
            .then(port => port.connect(this.onMidiIn))
    }

    onMidiIn(msg){
        console.log(msg);
    }
}