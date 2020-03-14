import STATUS from  "./../STATUS";

export default function checkLoopLength(prev, current){
    prev = prev.console;
    current = current.console;
    let response = null;
    for(let channelName of Object.keys(prev.channel)){
        const prevLoopLength = prev.channel[channelName].playBackState.loopLength;
        const currentLoopLength = current.channel[channelName].playBackState.loopLength;
        const currentLopp = current.channel[channelName].playBackState.loop;

        if(!currentLopp) return;

        if(prevLoopLength !== currentLoopLength){
            return {
                status : STATUS.LOOP_LENGTH_CHANGE,
                channel : channelName,
                currentValue : {
                    state : currentLopp,
                    loopLength : currentLoopLength
                }
            }                
        }
    }
    return response;
}