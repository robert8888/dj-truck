import STATUS from "./../STATUS";

export default function checkLoopState(prev, current) {
    let response = null;

    const prevValue = prev.midi.port;
    const currentValue = current.midi.port;

    if (prevValue !== currentValue && currentValue) {
        response = [{
            status: STATUS.MIDI_PORT_CHANGE,
            currentValue: currentValue,
        }];
    }

    return response;
}
