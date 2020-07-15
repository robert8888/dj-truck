import STATUS from "./../STATUS";

export default function eqGainChange(prev, current) {
    prev = prev.mixer;
    current = current.mixer;
    let response = null;
    for (let channelName of Object.keys(prev.channels)) {
        const prevValue = prev.channels[channelName].volume.current;
        const currentValue = current.channels[channelName].volume.current;
        if (prevValue !== currentValue) {
            response = response || [];
            response.push({
                status: STATUS.VOLUME_CHANGE,
                channel: channelName,
                prevValue: prevValue,
                currentValue: currentValue
            });
        }
    }
    return response;
}
