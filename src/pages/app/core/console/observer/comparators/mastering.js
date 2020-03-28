import STATUS from "./../STATUS";

export default function effectParam(prev, current) {
    prev = prev.mastering;
    current = current.mastering;

    if(!current.lastChange){
        return 
    }

    if ((current.lastChange.signature !== prev?.lastChange?.signature) ||
        (current.lastChange.value !== prev?.lastChange?.value)) {
            switch(current.lastChange.signature){
                case "#preGain": {
                    return {
                        status: STATUS.MASTERING,
                        subStatus: STATUS.MASTER_PRE_GAIN_CHANGE,
                        value: current.lastChange.value,
                    }
                }
                case "#postGain": {
                    return {
                        status: STATUS.MASTERING,
                        subStatus: STATUS.MASTER_POST_GAIN_CHANGE,
                        value: current.lastChange.value,
                    }
                }
                case "#threshold": {
                    return {
                        status: STATUS.MASTERING,
                        subStatus: STATUS.MASTER_THRESHOLD_CHANGE,
                        value: current.lastChange.value,
                    }
                }
                case "#ratio": {
                    return {
                        status: STATUS.MASTERING,
                        subStatus: STATUS.MASTER_RATIO_CHANGE,
                        value: current.lastChange.value,
                    }
                }
                case "#attack": {
                    return {
                        status: STATUS.MASTERING,
                        subStatus: STATUS.MASTER_ATTACK_CHANGE,
                        value: current.lastChange.value,
                    }
                }
                case "#release": {
                    return {
                        status: STATUS.MASTERING,
                        subStatus: STATUS.MASTER_RELEASE_CHANGE,
                        value: current.lastChange.value,
                    }
                }
                default: return null;
            }
        }
    else {
        return null;
    }
}