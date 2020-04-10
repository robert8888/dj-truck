import STATUS from "./../STATUS";

export default function checkPitchChange(prev, current) {
  prev = prev.console;
  current = current.console;
  let response = null;
  for (let channelName of Object.keys(prev.channel)) {
    const prevValue = prev.channel[channelName].playBackState.pitch;
    const currentValue = current.channel[channelName].playBackState.pitch;
    if (prevValue !== currentValue) {
        response = response || [];
        response.push({
        status: STATUS.PITCH_CHANGE,
        channel: channelName,
        prevValue: prevValue,
        currentValue: currentValue
      });
    }
  }
  return response;
}
