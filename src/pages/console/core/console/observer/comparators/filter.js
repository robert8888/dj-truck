import STATUS from "./../STATUS";

export default function mixerChannelFitlerChange(prev, current) {
  prev = prev.mixer;
  current = current.mixer;
  let response = null;
  for (let channelName of Object.keys(prev.channels)) {
    const prevValue = prev.channels[channelName].filter.current;
    const currentValue = current.channels[channelName].filter.current;
    if (prevValue !== currentValue) {
      response = response || [];
      response.push({
        status: STATUS.FILTER_CHANGE,
        channel: channelName,
        prevValue: prevValue,
        currentValue: currentValue
      });
    }
  }
  return response;
}
