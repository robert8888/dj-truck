import STATUS from "./../STATUS";

export default function eqGainChange(prev, current) {
  prev = prev.mixer;
  current = current.mixer;
  let response = [];
  for (let channelName of Object.keys(prev.channels)) {
    const prevValue = prev.channels[channelName].sends;
    const currentValue = current.channels[channelName].sends;
    prevValue.forEach( ( _ , index) => {
        if(prevValue[index] !== currentValue[index]){
            response.push({
              status: STATUS.SEND_CHANGE,
              channel: channelName,
              send : index,
              currentValue: currentValue[index]
            });
        }
    })
  }
  return response;
}
