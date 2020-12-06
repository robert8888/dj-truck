import store from "./../../../../../../store";

import {
  setChannelReady,
  setLoadingProgress,
  setTimeLeft,
  togglePlay,
  setLoop
} from "./../../../../../../actions";

export default class EventHandler {
  constructor() {
    this.dispatch = store.dispatch;
  }

  CreateEventHandling(channel) {
    this.onLoad(channel);
    this.onLoading(channel);
    this.onReady(channel);
   // this.onPlay(channel);
    this.onStop(channel);

    this.onSlaveSeek(channel);
    this.onMasterSeek(channel);
    this.onFinish(channel);
  }
  // --- events below

  onLoad(channel) {
    channel.master.on("load", () => {
      this.clearState(channel);
      console.log("load")
    });
  }

  onLoading(channel) {
    channel.master.on("loading", progress => {
      this.dispatch(setLoadingProgress(channel.channelName, progress));
   //   console.log("loding", progress, performance.now())
    });
    // channel.master.on("processing", () => {
    //   console.log("processing", performance.now())
    // })
    // channel.master.on("processed", () => {
    //   console.log("processed", performance.now())
    // })
  }


  onReady(channel) {
    channel.master.on("ready", () => {
      channel.currentDuration = channel.master.getDuration();
      console.log("channel ready")
      this.dispatch(setLoadingProgress(channel.channelName, 100));
      this.dispatch(setChannelReady(true, channel.channelName));

      this.startSync(channel);
    });


    console.log(channel.master)
    const haveBufferedEvents = channel.master.initialisedPluginList.PeaksAsyncPlugin;
    channel.master.on(["ready","buffered"][+!!haveBufferedEvents],  () => {
      const resolution = 280;
      const peaks = channel.master.backend.getPeaks(resolution, 0 , resolution);
      const start = 0;
      const end = peaks.length / 2;
      const width = channel.slave.params.container.getBoundingClientRect().width
      channel.slave.drawer.drawPeaks(peaks, width, start, end);
    });


  }

  onStop(channel){
    channel.master.on('pause', ()=>{
      clearInterval(channel._clockHandle)
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
      this.dispatch(togglePlay(channel.channelName));
      clearInterval(channel._clockHandle);
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
      channel.slave.drawer.progress(
        channel.master.backend.getPlayedPercents()
      );
    }, 500);
  };
}
