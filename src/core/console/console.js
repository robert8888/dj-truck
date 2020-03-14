import store from "./../../store";
import Observer from "./observer/observer";
import STATUS from "./observer/STATUS";
import { togglePlay,
         setTimeLeft }
         from "./../../actions";
import Channels from "./channels/channels";
import Mixer from "./mixer/mixer";

let mixConsole;

export default class Console{
    constructor(){
        store.subscribe(this.handleChange.bind(this));
        this.dispatch = store.dispatch;
        this.observer = new Observer(store);

        this.channels = new Channels();
        this.mixer = new Mixer(this.channels);

    }

    static Create(){
        mixConsole = new Console();
    }

    static Get(){
        if(!mixConsole){
            mixConsole = new Console();
            return mixConsole;
        } else {
            return mixConsole;
        }
    }

    getMixerChannelInterface(channelName){
        return this.mixer.getChannelInterface(channelName);
    }

    getChannelInterface(channelName){
        return this.channels.getChannelInterface(channelName);
    }


    createChannel(channelName, ...args){
        this.channels.createChannel(channelName, ...args);
        this.mixer.setUpAudioNodes(channelName);
    }

    handleChange(){
        const storeChanges = this.observer.check();
        for(let diff of storeChanges){
            this.callAction(diff);
        }
    }

    callAction(diff){
        switch(diff.status){
            case STATUS.TRACK_LOADED : {
                this.channels.loadTrack(diff.channel, diff.currentValue);
                break;
            }

            case STATUS.BPM_AND_OFFSET_READY : {
                this.channels.createBars(diff.channel, diff.currentValue)
            }
            
            case STATUS.TOGGLE_PLAY : {
                this.channels.togglePlay(diff.channel, diff.currentValue);
                break;
            }
            case STATUS.TOGGLE_CUE : {
                this.channels.toggleCue(diff.channel, diff.currentValue)
                break;
            }
            case STATUS.PITCH_CHANGE : {
                this.channels.adjustPitch(diff.channel, diff.currentValue)
                break;
            }
            case STATUS.GAIN_CHANGE : {
                this.mixer.setGain(diff.channel, diff.currentValue);
                break;
            }
            case STATUS.EQ_LOW_CHANGE : {
                this.mixer.setEqLow(diff.channel, diff.currentValue);
                break;
            }
            case STATUS.EQ_MID_CHANGE : {
                this.mixer.setEqMid(diff.channel, diff.currentValue);
                break;
            }
            case STATUS.EQ_HI_CHANGE : {
                this.mixer.setEqHigh(diff.channel, diff.currentValue);
                break;
            }
            case STATUS.FADER_CHANGE : {
                this.mixer.setFader(diff.currentValue);
                break;
            }

            case STATUS.SYNC_ACTIVATE : {
                this.channels.sync(diff.channel);
            }

            case STATUS.LOOP_CHANGE : {
                if(diff.currentValue.state){
                    this.channels.makeLoop(diff.channel, diff.currentValue);
                } else {
                    this.channels.endLoop(diff.channel);
                }
                break;
            }

            case STATUS.LOOP_LENGTH_CHANGE : {
                this.channels.updateLoop(diff.channel, diff.currentValue);
                break;
            }

            default : return; 
        }
    }

}