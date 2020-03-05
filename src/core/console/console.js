import store from "./../../store";
import Observer from "./observer/observer";
import STATUS from "./observer/STATUS";
import { togglePlay,
         setTimeLeft,
         setCuePoint, }
         from "./../../actions/actions";
import Player from "../../components/Deck/Player/Player";

let mixConsole;
export default class Console{
    constructor(){
        store.subscribe(this.handleChange.bind(this));
        this.dispatch = store.dispatch;
        this.observer = new Observer(store);
        this.channels = {
            A: null, 
            B: null
        }
    }

    static Init(){
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

    setPlayer(channel, player){
        this.channels[channel] = player;
        this.attachEvents(channel);
    }

    attachEvents(channel){
        const player = this.channels[channel];
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
                watcher = setInterval(()=>{
                        if(((new Date()).getTime() - lastCall.time) >= 100)
                        {
                            this.dispatch(setTimeLeft(channel, parseInt(player.getDuration() * lastCall.value)))
                            clearInterval(watcher);
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
                this.togglePlay(diff.channel, diff.currentValue);
                break;
            }
            case STATUS.TOGGLE_CUE : {
                this.toggleCue(diff.channel, diff.currentValue)
                break;
            }

            default : return; //by default don't call any action 
        }
    }

    togglePlay(channelName, currentValue){
        if(currentValue)//paused true
        {
            this.channels[channelName].pause();
        } else {
            this.channels[channelName].play();
        }
    }

    toggleCue(channelName, currentValue){
        const player = this.channels[channelName]
        const isPaused = store.getState().console.channel[channelName].playBackState.paused;
        if(!currentValue && isPaused){ // back to cue point and pause
            let cuePoint =  store.getState().console.channel[channelName].playBackState.cuePoint; //in seconds
            //seek to
            player.pause();
            player.backend.seekTo(cuePoint);
            player.drawer.progress(cuePoint / player.getDuration());
            player.drawer.recenter(cuePoint / player.getDuration());
        } else if(!currentValue) { //Cancel cue and play
            if(!player.isPlaying()){
                player.play();
            }
        }
        else {
            const cuePoint = this.channels[channelName].getCurrentTime();
            this.channels[channelName].play();
            this.dispatch(setCuePoint(channelName, cuePoint)) // in float seconds
        }
    }
}