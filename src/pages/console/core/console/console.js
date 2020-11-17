import store from "./../../../../store";
import Channels from "./channels/channels";
import Effector from "./effector/effector";
import Mixer from "./mixer/mixer";
import Observer from "./observer/observer";
import STATUS from "./observer/STATUS";
import MidiController from "./control/midi";
import KbdController from "./control/kbd";



export default class Console{

    constructor(){
        store.subscribe(this.handleChange.bind(this));
        this.dispatch = store.dispatch;
        this.observer = new Observer(store);

        this.channels = new Channels();
        this.mixer = new Mixer(this.channels);
        this.effector = new Effector(this.mixer.mainAudioContext);
        this.mixer.connect(this.effector);
        this.midiControler = new MidiController();
        this.kbdControler = new KbdController();
    }

    static Get(){
        return new Promise((res, rej) => {
            if(!Console.instance){
                try{
                    let _console = new Console();
                    Console.instance = _console;
                    res(Console.instance);
                }
                catch(error){
                    rej(error);
                }
            } else {
                res(Console.instance);
            }
        })
    }

    getMixerChannelInterface(channelName){
        return this.mixer.getChannelInterface(channelName);
    }

    getMixerMasterInterface(){
        return this.mixer.getMasteringInterface()
    }

    getChannelInterface(channelName){
        return this.channels.getChannelInterface(channelName);
    }

 

    createChannel(channelName, ...args){
        const buildChannel = () => {
            args.push(this.mixer.mainAudioContext);
            this.channels.createChannel(channelName, ...args);
            this.mixer.setUpChannelsAudioNodes(channelName);
        }
    
        setTimeout(buildChannel.bind(this), 0);

    }

    handleChange(){
        const storeChanges = this.observer.check();
        for(let diff of storeChanges){
            this.callAction(diff);
        }
    }

    callAction(diff){

        switch(diff.status){
            //-- PLAY BACK

            case STATUS.TRACK_LOADED : {
                this.channels.loadTrack(diff.channel, diff.currentValue);
                break;
            }

            case STATUS.TOGGLE_PLAY : {
                this.channels.togglePlay(diff.channel, diff.currentValue);
                break;
            }
            case STATUS.TOGGLE_CUE : {
                this.channels.toggleCue(diff.channel, diff.currentValue)
                break;
            }

            //----BPM AND SYNC
            case STATUS.BPM_AND_OFFSET_READY : {
                console.log("bar sync", diff.channel)
                this.channels.createBars(diff.channel, diff.currentValue);
                break;
            }
            
            case STATUS.PITCH_CHANGE : {
                this.channels.adjustPitch(diff.channel, diff.currentValue)
                break;
            }

            case STATUS.SYNC_ACTIVATE : {
                this.channels.sync(diff.channel);
                break;
            }

            //---- MIXER 
            case STATUS.GAIN_CHANGE : {
                this.mixer.setGain(diff.channel, diff.currentValue);
                break;
            }

            case STATUS.VOLUME_CHANGE: {
                this.mixer.setVolume(diff.channel, diff.currentValue);
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

            case STATUS.FILTER_CHANGE : {
                this.mixer.setFilterFreq(diff.channel, diff.currentValue);
                break;
            }

            case STATUS.FILTER_RES_CHANGE : {
                this.mixer.setFiterResonas(diff.channel, diff.currentValue);
                break;
            }

            case STATUS.SEND_CHANGE : {
                this.mixer.setSend(diff.channel, diff.send, diff.currentValue)
                break;
            }

            case STATUS.FADER_CHANGE : {
                this.mixer.setFader(diff.currentValue);
                break;
            }

            case STATUS.CUE_CHANGE : {
                this.mixer.setCue(diff.channel, diff.currentValue)
                break;
            }


            // -- LOOPER
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


            // -- EFFECTOR 
            case STATUS.DRY_WET_CHANGED : {
                this.effector.setDryWet(diff.channel, diff.currentValue);
                break;
            }

            case STATUS.CURRENT_EFFECT_CHANGED: {
                this.effector.connectEffect(diff.channel, diff.currentValue)
                break;
            }

            case STATUS.EFFECT_PARAM_CHANGED : {
                this.effector.setParam(diff.channel, diff.effect, diff.param)
                break;
            }

            //------ MASTERING

            case STATUS.MASTERING : {
                this.mixer.mastering.setMasterParam(diff.subStatus, diff.value);
                break;
            }

            //----- Recorder 
            case STATUS.RECORDER : {
                this.mixer.recorder.action(diff.subStatus, diff.recParam);
                break;
            }

            // ------ Control Midi
            case STATUS.MIDI_PORT_CHANGE : {
                this.midiControler.updateMidiPort(diff.currentValue)
                break;
            }

            default : return; 
        }
    }

}