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

    setPlayer(channelName, player){
        this.channels.setChannel(channelName, player);
        this.attachEvents(channelName);
    }

    attachEvents(channel){
        const player = this.channels.getChannel(channel);
        player.on('finish', ()=>{
            this.dispatch(togglePlay(channel))
        })

        let lastUpdate = (new Date()).getTime();
        player.on('audioprocess', ()=>{
            const currentTime = (new Date()).getTime();
            if((currentTime - lastUpdate) >= 999){
                lastUpdate = currentTime;
                this.dispatch(setTimeLeft(channel, parseInt(player.getDuration() - player.getCurrentTime())))
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
                            this.dispatch(setTimeLeft(channel, parseInt(player.getDuration() * lastCall.value)))
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

            default : return; 
        }
    }

 
}