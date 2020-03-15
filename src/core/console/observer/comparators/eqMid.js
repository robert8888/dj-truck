import STATUS from "./../STATUS";

export default function eqMidChange(prev, current) {
  prev = prev.mixer;
  current = current.mixer;
  let response = null;
  for (let channelName of Object.keys(prev.channels)) {
    const prevValue = prev.channels[channelName].mid;
    const currentValue = current.channels[channelName].mid;
    if (prevValue !== currentValue) {
      response = response || [];
      response.push({
        status: STATUS.EQ_MID_CHANGE,
        channel: channelName,
        prevValue: prevValue,
        currentValue: currentValue
      });
    }
  }
  return response;
}
