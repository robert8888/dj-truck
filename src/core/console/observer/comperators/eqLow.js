import STATUS from  "./../STATUS";

export default function eqLowChange(prev, current){
    prev = prev.mixer;
    current = current.mixer;
    let response = null;
    for(let channelName of Object.keys(prev.channels)){
        const prevValue = prev.channels[channelName].low
        const currentValue = current.channels[channelName].low;
        if( prevValue !== currentValue)
            {
                return {
                    status : STATUS.EQ_LOW_CHANGE,
                    channel : channelName,
                    prevValue : prevValue,
                    currentValue : currentValue
                }                
            }
    }
    return response;
}