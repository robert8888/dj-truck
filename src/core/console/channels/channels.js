import store from "./../../../store/";
import { setCuePoint }
    from "./../../../actions/actions";

export default class Channels{
    constructor(){
        this.dispatch = store.dispatch;
        this.channels = {
            A: null, 
            B: null
        }
    }

    setChannel(channelName, player){
        this.channels[channelName] = player;
    }

    getChannel(channelName){
        return this.channels[channelName];
    }
    
    //--------------------------------------------
    togglePlay(channelName, currentValue){
        if(currentValue){
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

    adjustPitch(channelName, currentValue){
        this.channels[channelName].setPlaybackRate( 1 + currentValue/100 )
    }
}