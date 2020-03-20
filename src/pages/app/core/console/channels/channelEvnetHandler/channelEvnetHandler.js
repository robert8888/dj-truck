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
    this.onProcess(channel);
    this.onSlaveSeek(channel);
    this.onMasterSeek(channel);
    this.onFinish(channel);
  }
  // --- events below

  onLoad(channel) {
    channel.master.on("load", () => {
      this.clearState(channel);
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
      //resolution value is taken from manual test
      const resolution = 280;
      channel.slave.load(null, channel.master.backend.getPeaks(resolution, 0, resolution) );
      this.dispatch(setLoadingProgress(channel.channelName, 100));

      this.dispatch(setChannelReady(true, channel.channelName));
      this.startSync(channel);
    });
  }

  onProcess(channel) {
    let lastUpdate = new Date().getTime();
    channel.master.on("audioprocess", () => {
      const currentTime = new Date().getTime();
      if (currentTime - lastUpdate >= 500) {
        lastUpdate = currentTime;
        const timeLeft = parseInt(channel.master.getDuration() - channel.master.getCurrentTime());
        this.dispatch(setTimeLeft(channel.channelName, timeLeft));
      }
    });
  }

  onSlaveSeek(channel) {
    channel.slave.on("seek", progress => {
      const wasPlaying = channel.master.isPlaying();

      channel.master.backend.seekTo(progress * channel.currentDuration);
      channel.master.drawer.progress(progress);
      channel.master.fireEvent("seek", progress);

      channel.slave.drawer.progress(progress);

      const timeLeft = parseInt(channel.master.getDuration() - channel.master.getDuration() * progress);
      this.dispatch(setTimeLeft(channel.channelName, timeLeft));

      if (wasPlaying) {
        channel.master.play();
      }
    });
  }

  onMasterSeek(channel) {
    // updating time Left value
    ///Because on seek event is called a 1000 time per second, is created watcher witch update
    // value after 500 ms with last progress value
    let watcher = null;
    let lastCall = {
      time: new Date().getTime(),
      value: null
    };

    channel.master.on("seek", progress => {
      lastCall.time = new Date().getTime();
      lastCall.progress = progress;
      if (!watcher) {
        watcher = setTimeout(() => {
          if (new Date().getTime() - lastCall.time >= 100) {
            const timeLeft = parseInt(channel.master.getDuration() * lastCall.progress);
            this.dispatch(setTimeLeft(channel.channelName, timeLeft));
            clearTimeout(watcher);
            watcher = null;
          }
        }, 500);
      }
    });

    this.dispatch(setLoop(channel.channelName, false));
  }


  onFinish(channel) {
    channel.master.on("finish", () => {
      this.dispatch(togglePlay(channel.channelName));
    });
  }

  //---------------------------------------
  clearState(channel) {
    channel.slave.load(null, []);
    if (channel.barsElements) {
      channel.barsElements.forEach(htmlElement => htmlElement.remove());
    }
  }

  startSync = channel => {
    channel.syncHandle = setInterval(() => {
      channel.slave.drawer.progress(
        channel.master.getCurrentTime() / channel.currentDuration
      );
    }, 100);
  };
}
