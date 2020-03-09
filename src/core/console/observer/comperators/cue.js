import STATUS from  "./../STATUS";
/*
const responseTempalte = {
    status : STATUS,
    chanel: "A or B",
    prevValue: 0,
    currentValue: 0,  
}*/

export default function cueActive(prev, current){
    prev = prev.console;
    current = current.console;
    let response = null;
    for(let channelName of Object.keys(prev.channel)){
        const prevValue = prev.channel[channelName].playBackState.cueActive;
        const currentValue = current.channel[channelName].playBackState.cueActive;
        if( prevValue !== currentValue)
            {
                return {
                    status : STATUS.TOGGLE_CUE,
                    channel : channelName,
                    prevValue : prevValue,
                    currentValue : currentValue
                }                
            }
    }
    return response;
}