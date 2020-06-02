import STATUS from "./../STATUS";

export default function cueChange(prev, current) {
  prev = prev.mixer;
  current = current.mixer;
  let response = null;
  for (let channelName of Object.keys(prev.channels)) {
    const prevValue = prev.channels[channelName].cue;
    const currentValue = current.channels[channelName].cue;
    if (prevValue !== currentValue) {
      response = response || [];
      response.push({
        status: STATUS.CUE_CHANGE,
        channel: channelName,
        prevValue: prevValue,
        currentValue: currentValue
      });
    }
  }
  return response;
}
