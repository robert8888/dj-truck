import STATUS from "./../STATUS";

export default function currentEffectChanged(prev, current) {
  prev = prev.effector;
  current = current.effector;
  let response = null;

  if (!current.lastChange.sygnature ||
    (current.lastChange.sygnature && !current.lastChange.sygnature.startsWith("#EffectChange"))) {
    return null
  } else {
    const prevValue = prev.channels[current.lastChange.channel].currentEffect;
    const currentValue = current.channels[current.lastChange.channel].currentEffect;
    if (prevValue !== currentValue) {
      response = response || [];
      response.push({
        status: STATUS.CURRENT_EFFECT_CHANGED,
        channel: current.lastChange.channel,
        currentValue: current.lastChange.effect
      })
    }
  }

  return response;
}
