import STATUS from "./../observer/STATUS";


export default class Mastering {
    constructor(mixer) {
        this.mixer = mixer;


        this.defaultCompressor = {
            threshold: 0,
            ratio: 1,
            attack: .003,
            release: 0.25,
        }
    }

    getMain() {
        return this.mixer.audioNodes.channels['main'];
    }

    setMasterParam(status, value) {
        const main =  this.getMain();
        switch(status){
            case STATUS.MASTER_PRE_GAIN_CHANGE : {
                this.setAudioParam(main.preGainNode, "gain", (1 + value/100))
                return;
            }
            case STATUS.MASTER_POST_GAIN_CHANGE: {
                this.setAudioParam(main.postGainNode, "gain", (1 + value/100))
                return;
            }
            case STATUS.MASTER_THRESHOLD_CHANGE: {
                this.setAudioParam(main.compressorNode, "threshold", value);
                return;
            }
            case STATUS.MASTER_RATIO_CHANGE : {
                this.setAudioParam(main.compressorNode, "ratio", value);
                return;
            }
            case STATUS.MASTER_ATTACK_CHANGE:{
                this.setAudioParam(main.compressorNode, "attack", value);
                return;
            }
            case STATUS.MASTER_RELEASE_CHANGE:{
                this.setAudioParam(main.compressorNode, "release", value);
                return;
            }
            default: return;
        }
    }

    configCompressor() {
        const compressorNode = this.getMain().compressorNode ;
        Object.entries(this.defaultCompressor).forEach(([variable, value]) => {
            this.setAudioParam(compressorNode, variable, value)
        });
    }

    setAudioParam(audioNode, variable, value) {
        audioNode[variable].setTargetAtTime(value, this.mixer.mainAudioContext.currentTime, 0.01)
    }
}