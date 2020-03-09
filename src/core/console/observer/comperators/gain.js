import STATUS from  "./../STATUS";

export default function eqGainChange(prev, current){
    prev = prev.mixer;
    current = current.mixer;
    let response = null;
    for(let channelName of Object.keys(prev.channels)){
        const prevValue = prev.channels[channelName].gain
        const currentValue = current.channels[channelName].gain;
        if( prevValue !== currentValue)
            {
                return {
                    status : STATUS.GAIN_CHANGE,
                    channel : channelName,
                    prevValue : prevValue,
                    currentValue : currentValue
                }                
            }
    }
    return response;
}