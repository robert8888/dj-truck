import STATUS from "./../STATUS";

export default function checkIsPlaying(prev, current) {
  prev = prev.console;
  current = current.console;
  let response = null;
  for (let channelName of Object.keys(prev.channel)) {
    const prevValue = prev.channel[channelName].playBackState.paused;
    const currentValue = current.channel[channelName].playBackState.paused;
    if (prevValue !== currentValue) {
        response = response || [];
        response.push({
        status: STATUS.TOGGLE_PLAY,
        channel: channelName,
        prevValue: prevValue,
        currentValue: currentValue
      });
    }
  }
  return response;
}
