import STATUS from "./../STATUS";

export default function dryWetChanged(prev, current) {
  prev = prev.effector;
  current = current.effector;

  if (!current.lastChange.sygnature ||
    (current.lastChange.sygnature && !current.lastChange.sygnature.startsWith("#DryWetChange"))) {
    return null
  } else {
    const prevValue = prev.channels[current.lastChange.channel].dryWet.current;
    const currentValue = current.channels[current.lastChange.channel].dryWet.current;
    if (prevValue !== currentValue) {
      return [{
        status: STATUS.DRY_WET_CHANGED,
        channel: current.lastChange.channel,
        currentValue: current.lastChange.value
      }];
    }
  }
}
