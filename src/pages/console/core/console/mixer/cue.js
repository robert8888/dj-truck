import { toRange } from "./../../../../../utils/math/argRanges";

export default {
    setCue(channel, value){
        value = toRange(value, 0 , 1);
        this.audioNodes.channels[channel].cue.cueGainNode
            .gain.setTargetAtTime(value, this.mainAudioContext.currentTime, 0.01);
    }
}