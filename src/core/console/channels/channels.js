import store from "./../../../store/";
import Synchronizer from "./sync/synchronizer";
import getApi from "./../../../apis/apiProvider";
import {setCuePoint, 
        setChannelReady, 
        setTimeLeft 
      } from "./../../../actions";

export default class Channels {
  constructor() {
    this.synchronizer = new Synchronizer(this);
    this.dispatch = store.dispatch;
    this.channels = {
      A: null,
      B: null
    };

    this.stdDivceDiff = {};
  }

  getChannelNames() {
    return Object.keys(this.channels);
  }

  setChannel(channelName, player) {
    this.channels[channelName] = player;
  }

  getChannel(channelName) {
    return this.channels[channelName];
  }

  getChannelInterface(channelName) {
    return {
      getSyncBarPosition: () => this.synchronizer.getSyncBarPostion
                                .call(this.synchronizer,channelName)
    };
  }

  //--------------------------------------------

  loadTrack(channelName, track) {
    let api = getApi(track.source);
    let url = (api && api.getUrl(track.id)) || null;

    this.dispatch(setChannelReady(false, channelName));

    let player = this.channels[channelName];

    if (player.loadWithEvent) {
      player.loadWithEvent(url);
    } else {
      player.load(url);
    }
  }

  updatePosition(channelName) {
    this.updateTimeLeft(channelName);
  }

  updateTimeLeft(channelName) {
    let channel = this.channels[channelName];
    this.dispatch(
      setTimeLeft(
        channelName,
        parseInt(channel.getDuration() - channel.getCurrentTime())
      )
    );
  }

  togglePlay(channelName, currentValue) {
    if (currentValue) {
      this.channels[channelName].pause();
    } else {
      this.channels[channelName].play();
    }
  }

  toggleCue(channelName, currentValue) {
    const player = this.channels[channelName];
    const isPaused = store.getState().console.channel[channelName]
                    .playBackState.paused;
    if (!currentValue && isPaused) {
      // back to cue point and pause
      let cuePoint = store.getState().console.channel[channelName]
                    .playBackState.cuePoint; //in seconds
      //seek to
      player.pause();
      player.backend.seekTo(cuePoint);
      player.drawer.progress(cuePoint / player.getDuration());
      player.drawer.recenter(cuePoint / player.getDuration());
    } else if (!currentValue) {
      //Cancel cue and play
      if (!player.isPlaying()) {
        player.play();
      }
    } else {
      const cuePoint = this.channels[channelName].getCurrentTime();
      this.channels[channelName].play();
      this.dispatch(setCuePoint(channelName, cuePoint)); // in float seconds
    }
  }

  adjustPitch(channelName, currentValue) {
    this.channels[channelName].setPlaybackRate(1 + currentValue / 100);
  }

  sync(channelName){
    this.synchronizer.sync(channelName);
  }

}
