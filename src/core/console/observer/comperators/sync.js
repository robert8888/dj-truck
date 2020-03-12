import STATUS from  "./../STATUS";

export default function checkPitchChange(prev, current){
    prev = prev.console;
    current = current.console;
    let response = null;
    for(let channelName of Object.keys(prev.channel)){
        const prevValue = prev.channel[channelName].playBackState.sync;
        const currentValue = current.channel[channelName].playBackState.sync;
        if( prevValue !== currentValue && currentValue === true)
            {
                return {
                    status : STATUS.SYNC_ACTIVATE,
                    channel : channelName,
                    prevValue : prevValue,
                    currentValue : currentValue
                }                
            }
    }
    return response;
}