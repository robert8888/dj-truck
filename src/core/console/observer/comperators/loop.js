import STATUS from  "./../STATUS";

export default function checkLoopState(prev, current){
    prev = prev.console;
    current = current.console;
    let response = null;
    for(let channelName of Object.keys(prev.channel)){
        const prevValue = prev.channel[channelName].playBackState.loop;
        const currentValue = current.channel[channelName].playBackState.loop;

        const loopLength = current.channel[channelName].playBackState.loopLength;
        if(prevValue !== currentValue){
            return {
                status : STATUS.LOOP_CHANGE,
                channel : channelName,
                currentValue : {
                    state : currentValue,
                    loopLength : loopLength
                }
            }                
        }
    }
    return response;
}