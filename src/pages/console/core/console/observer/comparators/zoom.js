import STATUS from "./../STATUS";

export default function checkPitchChange(prev, current) {
    prev = prev.console;
    current = current.console;
    let response = null;
    for (let channelName of Object.keys(prev.channel)) {
        const prevValue = prev.channel[channelName].deckState.zoom.current;
        const currentValue = current.channel[channelName].deckState.zoom.current;
        if (prevValue !== currentValue) {
            const currentBpm = current.channel[channelName].track.bpm;
            const currentOffset = current.channel[channelName].playBackState.offset;

            const loop = current.channel[channelName].playBackState.loop;
            const currentLoopLength = current.channel[channelName].deckState.loopLength.current;
            const loopLength = current.channel[channelName].deckState.loopLengths[currentLoopLength];

            response = response || [];
            response.push({
                status: STATUS.ZOOM_CHANGE,
                channel: channelName,
                prevValue: prevValue,
                currentValue: currentValue,
                sync: {
                    bpm: currentBpm,
                    offset: currentOffset
                },
                loop: {
                    state: loop,
                    loopLength: loopLength
                }
            });
        }
    }
    return response;
}
