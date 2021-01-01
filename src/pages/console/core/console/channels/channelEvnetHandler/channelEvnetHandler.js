import store from "./../../../../../../store";

import {
  setChannelReady,
  setLoadingProgress,
  togglePlay,
  setLoop, setProcessing
} from "./../../../../../../actions";

export default class EventHandler {
  constructor() {
    this.dispatch = store.dispatch;
  }

  createEventHandling(channel) {
    this.onLoad(channel);
    this.onLoading(channel);
    this.onReady(channel);
    this.onStop(channel);

    this.onSlaveSeek(channel);
    this.onMasterSeek(channel);
    this.onFinish(channel);
  }

  destroy(channel){
    clearInterval(channel.syncHandle)
  }


  onLoad(channel) {
    const haveProcessedEvent = channel.master.initialisedPluginList.PeaksAsyncPlugin;
    channel.master.on("load", () => {
      this.clearState(channel);
      if(haveProcessedEvent){
        this.dispatch(setProcessing(channel.channelName, true))
      }
    });
  }

  onLoading(channel) {
    channel.master.on("loading", progress => {
      this.dispatch(setLoadingProgress(channel.channelName, progress));
    });
  }


  onReady(channel) {
    channel.master.on("ready", () => {
      channel.currentDuration = channel.master.getDuration();
      this.dispatch(setLoadingProgress(channel.channelName, 100));
      this.dispatch(setChannelReady(true, channel.channelName));
      this.startSync(channel);
    });

    const haveBufferedEvents = channel.master.initialisedPluginList.PeaksAsyncPlugin;

    if(haveBufferedEvents){
      channel.master.on("processed", () => {
        this.dispatch(setProcessing(channel.channelName, false))
      })
    }

    channel.master.on(haveBufferedEvents ? "buffered" : "ready",  () => {
      const width = channel.slave.params.container.getBoundingClientRect().width
      const resolution = 600 * window.devicePixelRatio;
      const peaks = channel.master.backend.getPeaks(resolution, 0 , resolution);
      const start = 0;
      const end = peaks.length / 2;

      const drawArguments = [peaks, width * window.devicePixelRatio, start, end]
      channel.slave.drawer.drawPeaks(...drawArguments);
      channel.slave.drawer._drawArguments = drawArguments;
    });

  }

  onStop(channel){
    channel.master.on('pause', ()=>{
    //  clearInterval(channel._clockHandle)
    })
  }

  onSlaveSeek(channel) {
    channel.slave.on("seek", progress => {
      const wasPlaying = channel.master.isPlaying();

      channel.master.backend.seekTo(progress * channel.currentDuration);
      channel.master.drawer.progress(progress);
      channel.master.fireEvent("seek", progress);

      channel.slave.drawer.progress(progress);

      if (wasPlaying) {
        channel.master.play();
      }
    });
  }

  onMasterSeek(channel) {

    channel.master.on("seek", progress => {
      if(channel.master.isPlaying()){
        channel.master.play();
      }
    });

    this.dispatch(setLoop(channel.channelName, false));
  }


  onFinish(channel) {
    channel.master.on("finish", () => {
      this.dispatch(togglePlay(channel.channelName, false));
      //clearInterval(channel._clockHandle);
    });
  }

  clearState(channel) {
    channel.slave.drawer.drawPeaks([], 0, 0, 0);
    if (channel.barsElements) {
      channel.barsElements.forEach(htmlElement => htmlElement.remove());
    }
  }

  startSync = channel => {
    channel.syncHandle = setInterval(() => {
      channel.slave.drawer &&
      channel.slave.drawer.progress(
        channel.master.backend.getPlayedPercents()
      );
    }, 500);
  };
}
