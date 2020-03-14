import STATUS from "./../STATUS";

export default function checkBpmAndOfset(prev, current) {
  prev = prev.console;
  current = current.console;
  let response = null;
  for (let channelName of Object.keys(prev.channel)) {
    const prevReady = prev.channel[channelName].playBackState.ready;
    const prevBpm = prev.channel[channelName].track.bpm;

    const currentReady = current.channel[channelName].playBackState.ready;
    const currentBpm = current.channel[channelName].track.bpm;
    const currentOffset = current.channel[channelName].playBackState.offset;
    
    if(!currentReady) return null;

    if (
      (prevReady !== currentReady &&
        currentBpm !== 0 &&
        currentOffset !== 0) ||
      (currentBpm !== prevBpm && currentOffset !== 0)
    ) {
      return {
        status: STATUS.BPM_AND_OFFSET_READY,
        channel: channelName,
        currentValue: {
          bpm: currentBpm,
          offset: currentOffset
        }
      };
    }
  }
  return response;
}
