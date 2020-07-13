import STATUS from  "./../STATUS";

export default function checkLoopLength(prev, current){
    prev = prev.console;
    current = current.console;
    let response = null;
    for(let channelName of Object.keys(prev.channel)){
        const prevLoopLength = prev.channel[channelName].deckState.loopLength.current;
        const currentLoopLength = current.channel[channelName].deckState.loopLength.current;
        const currentLoop = current.channel[channelName].playBackState.loop;
        if(!currentLoop) continue;

        const loopLength = current.channel[channelName].deckState.loopLengths[currentLoopLength];
        if(prevLoopLength !== currentLoopLength){
            response = response || [];
            response.push({
                status : STATUS.LOOP_LENGTH_CHANGE,
                channel : channelName,
                currentValue : {
                    state : currentLoop,
                    loopLength : loopLength
                }
            })                
        }
    }
    return response;
}