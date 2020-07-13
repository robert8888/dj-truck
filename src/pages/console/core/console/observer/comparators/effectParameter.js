import STATUS from "./../STATUS";

export default function effectParam(prev, current) {
  prev = prev.effector;
  current = current.effector;

  if(!current.lastChange.signature ||
    (current.lastChange.signature && !current.lastChange.signature.startsWith("#EffectParam"))) {
    return null
  } else {
    if(prev.lastChange.channel !== current.lastChange.channel ||
       prev.lastChange.effect !== current.lastChange.effect ||
      !shallowCompare(prev.lastChange.param, current.lastChange.param)) {
      return [{
        status: STATUS.EFFECT_PARAM_CHANGED,
        channel: current.lastChange.channel,
        effect: current.lastChange.effect,
        param: current.lastChange.param
      }];
    }
  }
}

function shallowCompare(objA, objB) {
  if ((!objA && objB) || (!objB && objA)) {
    return true;
  } else {
    return (
      Object.entries(objA).every(([keyA, valueA]) =>
        (objB[keyA] && objB[keyA] === valueA)
      )
      &&
      Object.entries(objB).every(([keyB, valueB]) =>
        (objA[keyB] && objA[keyB] === valueB)
      )
    )
  }
}