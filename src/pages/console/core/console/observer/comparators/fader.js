import STATUS from "./../STATUS";

export default function eqLowChange(prev, current) {
  prev = prev.mixer;
  current = current.mixer;

  let response = null;

  const prevValue = prev.fader.position;
  const currentValue = current.fader.position;
  if (prevValue !== currentValue) {
    response = response || [];
    response.push({
      status: STATUS.FADER_CHANGE,
      prevValue: prevValue,
      currentValue: currentValue
    });
  }

  return response;
}
