import STATUS from  "./../STATUS";

export default function checkLoopLength(prev, current){
    prev = prev.console;
    current = current.console;
    let response = null;
    for(let channelName of Object.keys(prev.channel)){
        const prevLoopLength = prev.channel[channelName].deckState.loopLength;
        const currentLoopLength = current.channel[channelName].deckState.loopLength;
        const currentLopp = current.channel[channelName].playBackState.loop;

        if(!currentLopp) continue;

        if(prevLoopLength !== currentLoopLength){
            response = response || [];
            response.push({
                status : STATUS.LOOP_LENGTH_CHANGE,
                channel : channelName,
                currentValue : {
                    state : currentLopp,
                    loopLength : currentLoopLength
                }
            })                
        }
    }
    return response;
}