import store from "./../../../store/";
import ChannelBuilder from "./channelBuilder/channelBuilder";
import Synchronizer from "./sync/synchronizer";
import getApi from "./../../../apis/apiProvider";
import {setCuePoint, 
        setChannelReady, 
        setTimeLeft 
      } from "./../../../actions";
import Looper from "./looper/looper";


export default class Channels {
  constructor() {
    this.channelBuilder = new ChannelBuilder();
    this.synchronizer = new Synchronizer(this);
    this.looper = new Looper();
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

  createChannel( channelName, ...args ){
    this.channels[channelName] = 
      this.channelBuilder.create( channelName, ...args); 
  }

  createBars( channelName, values ){
    this.channelBuilder.createBars( this.getFullChannel(channelName), values);
  }

  getChannel(channelName) {
    return this.channels[channelName].master;
  }

  getFullChannel(channelName){
    return this.channels[channelName];
  }

  getChannelInterface(channelName) {
    return {
      getSyncBarPosition: () => 
        this.synchronizer.getSyncBarPostion.call(this.synchronizer,channelName)
    };
  }

  //--------------------------------------------

  loadTrack(channelName, track) {
    let api = getApi(track.source);
    let url = (api && api.getUrl(track.id)) || null;

    this.dispatch(setChannelReady(false, channelName));

    let channel = this.getChannel(channelName);

    if (channel.loadWithEvent) {
      channel.loadWithEvent(url);
      console.log("loading", channel)
    } else {
      channel.load(url);
    }
  }

  togglePlay(channelName, currentValue) {
    if (currentValue) {
      this.getChannel(channelName).pause();
    } else {
      this.getChannel(channelName).play();
    }
  }

  toggleCue(channelName, currentValue) {
    const player = this.getChannel(channelName);
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
      const cuePoint = this.getChannel(channelName).getCurrentTime();
      this.getChannel(channelName).play();
      this.dispatch(setCuePoint(channelName, cuePoint)); // in float seconds
    }
  }

  adjustPitch(channelName, currentValue) {
    this.getChannel(channelName).setPlaybackRate(1 + currentValue / 100);
  }

  sync(channelName){
    this.synchronizer.sync(channelName);
  }

  makeLoop(channelName, {loopLength}){
    this.looper.makeLoop(this.getFullChannel(channelName), loopLength)
  }

  endLoop(channelName){
    this.looper.endLoop(this.getFullChannel(channelName));
  }

  updateLoop(channelName, {loopLength}){
    this.looper.updateLoop(this.getFullChannel(channelName), loopLength);
  }

}
