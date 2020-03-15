import STATUS from "./../STATUS";

export default function checkTrackLoaded(prev, current) {
  prev = prev.console;
  current = current.console;
  let response = null;
  for (let channelName of Object.keys(prev.channel)) {
    const prevValueSource = prev.channel[channelName].track.source;
    const prevValueId = prev.channel[channelName].track.id;
    const currentValueSource = current.channel[channelName].track.source;
    const currentValueID = current.channel[channelName].track.id;
    if (
      prevValueSource !== currentValueSource ||
      prevValueId !== currentValueID
    ) {
      response = response || [];
      response.push({
        status: STATUS.TRACK_LOADED,
        channel: channelName,
        prevValue: prev.channel[channelName].track,
        currentValue: current.channel[channelName].track
      });
    }
  }
  return response;
}
