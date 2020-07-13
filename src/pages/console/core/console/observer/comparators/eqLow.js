import STATUS from "./../STATUS";

export default function eqLowChange(prev, current) {
  prev = prev.mixer;
  current = current.mixer;
  let response = null;
  for (let channelName of Object.keys(prev.channels)) {
    const prevValue = prev.channels[channelName].low.current;
    const currentValue = current.channels[channelName].low.current;
    if (prevValue !== currentValue) {
      response = response || [];
      response.push({
        status: STATUS.EQ_LOW_CHANGE,
        channel: channelName,
        prevValue: prevValue,
        currentValue: currentValue
      });
    }
  }
  return response;
}
