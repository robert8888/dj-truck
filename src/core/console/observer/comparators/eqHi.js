import STATUS from "./../STATUS";

export default function eqHiChange(prev, current) {
  prev = prev.mixer;
  current = current.mixer;
  let response = null;
  for (let channelName of Object.keys(prev.channels)) {
    const prevValue = prev.channels[channelName].high;
    const currentValue = current.channels[channelName].high;
    if (prevValue !== currentValue) {
      response = response || [];
      response.push({
        status: STATUS.EQ_HI_CHANGE,
        channel: channelName,
        prevValue: prevValue,
        currentValue: currentValue
      });
    }
  }
  return response;
}
