import store from "store";
import { getBeatLength, calcBpm } from "utils/bpm/converter";
import { setPitch, setSync } from "actions";

export default class Synchronizer {
  constructor(channels) {
    this.channels = channels;
    this.dispatch = store.dispatch;
    this.stdDivceDiff = {}
  }

  getSyncBarPosition(channelName) {
    const data = this.getSyncData(channelName);
    if(!data) return null;

    const { diff, masterBeatLength } = data;
    return diff / masterBeatLength;
  }

  sync(channelName) {
    console.log("sync channel", channelName);
    const state = store.getState();
    if (channelName === state.console.master) { //you can't sync master to master
      this.dispatch(setSync(channelName, false));
      return;
    }

    const slaveChannel = this.channels.getChannel(channelName);

    const syncData = this.getSyncData(channelName);
    if (!syncData) {
      this.dispatch(setSync(channelName, false));
      return;
    }
    const masterBpm = state.console.channel[state.console.master].track.bpm;
    const currentMasterPitch = 
        state.console.channel[state.console.master].playBackState.pitch.current;
    const slaveBpm = state.console.channel[channelName].track.bpm;
    const newSlavePitch = 
        (calcBpm(masterBpm, currentMasterPitch) / slaveBpm - 1) * 100;
    this.dispatch(setPitch(channelName, newSlavePitch));

    slaveChannel.backend.seekTo(slaveChannel.getCurrentTime() + syncData.diff);
    slaveChannel.drawer.progress(slaveChannel.backend.getPlayedPercents());
    slaveChannel.play();

    this.dispatch(setSync(channelName, false));
  }

  getSyncData(channelName) {
    let state = store.getState();
    if (!state.console.master) return null;

    const masterChannel = this.channels.getChannel(state.console.master);
    const slaveChannel = this.channels.getChannel(channelName);
    if (!masterChannel.isPlaying() || !slaveChannel.isPlaying()) return null;

    // --- stabilization - cause :
    // masterChannel.getCurrentTime() - slaveChannel.getCurrentTime() is not stable as should be
    // cause of this is calculated average diff and deviation from this diff.
    if (!this.stdDivceDiff[channelName]) {
      //create
      this.stdDivceDiff = { ...this.stdDivceDiff, [channelName]: null };
      //set
      this.stdDivceDiff[channelName] = masterChannel.backend.ac.currentTime 
                                     - slaveChannel.backend.ac.currentTime;
    }

    const currentDdff = 
      masterChannel.backend.ac.currentTime - slaveChannel.backend.ac.currentTime;

    this.stdDivceDiff[channelName] =
      (this.stdDivceDiff[channelName] + currentDdff) / 2;

    const deviation = this.stdDivceDiff[channelName] - currentDdff;
    //----------------------

    let masterPosition = masterChannel.getCurrentTime();
    let slavePosition = slaveChannel.getCurrentTime() + deviation;

    const masterBpm = state.console.channel[state.console.master].track.bpm;
    const masterBeatLength = getBeatLength(masterBpm);
    const masterOffset = 
      state.console.channel[state.console.master].playBackState.offset;

    const slaveBpm = state.console.channel[channelName].track.bpm;
    const slaveBeatLength = getBeatLength(slaveBpm);
    const slaveOffset = 
      state.console.channel[channelName].playBackState.offset;

    const masterBeatPosition =
      (masterPosition - masterOffset) % masterBeatLength;

    const slaveBeatPosition =
      (slavePosition - slaveOffset) % slaveBeatLength;

    const beatDiff = masterBeatPosition - slaveBeatPosition;

    //when master track is in the current beat but slave is in the next one
    //and in invers situation
    const beatDiffEdgeNegative = masterBeatLength 
                               - masterBeatPosition 
                               + slaveBeatPosition; // slave is overtaking

    const beatDiffEdgePositive = slaveBeatLength 
                               + masterBeatPosition 
                               - slaveBeatPosition; // slave is delayed

    const min = Math.min(
      Math.abs(beatDiff),
      Math.abs(beatDiffEdgeNegative),
      Math.abs(beatDiffEdgePositive)
    );

    let diff;
    switch (min) {
      case Math.abs(beatDiff): {
        diff = beatDiff;
        break;
      }
      case Math.abs(beatDiffEdgeNegative): {
        diff = -Math.abs(beatDiffEdgeNegative);
        break;
      }
      case Math.abs(beatDiffEdgePositive): {
        diff = Math.abs(beatDiffEdgePositive);
        break;
      }
      default:
        diff = min;
    }

    return {
      diff,
      masterBeatLength
    };
  }
}
