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

    setPlayer(channelName, player){
        this.channels.setChannel(channelName, player);
        this.mixer.setUpAudioNodes(channelName);
        this.attachEvents(channelName);
    }

    attachEvents(channelName){
        const player = this.channels.getChannel(channelName);
        player.on('finish', ()=>{
            this.dispatch(togglePlay(channelName))
        })

        let lastUpdate = (new Date()).getTime();
        player.on('audioprocess', ()=>{
            const currentTime = (new Date()).getTime();
            if((currentTime - lastUpdate) >= 500){
                lastUpdate = currentTime;
            //    this.dispatch(setTimeLeft(channelName, parseInt(player.getDuration() - player.getCurrentTime())))
                this.channels.updatePosition(channelName)
            }
        })
        // updating time Left value
        ///Because on seek event is called a 1000 time per second, is created watcher witch update 
        // value after 500 ms with last progress value 
        let lastCall = {
            time :(new Date()).getTime(),
            value : null
        };
        let watcher = null;
        player.on('seek', progress => {
            lastCall.time = (new Date()).getTime();
            lastCall.value = progress;
            if(!watcher){
                watcher = setTimeout(()=>{
                        if(((new Date()).getTime() - lastCall.time) >= 100)
                        {
                            this.dispatch(setTimeLeft(channelName, parseInt(player.getDuration() * lastCall.value)))
                            clearTimeout(watcher);
                            watcher = null
                        }
                    }, 500)
            }
        })
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
            default : return; 
        }
    }

}