
export function toDbValue(value) {
    let gain = 1 + value / 100;
    let dB = Math.floor(20 * Math.log10(gain));
    return dB;
}

// based on value from myCurveFit.com
export function toGainCurve(value){
    if(value < 0 ){
        return   -(109.59 + (0.3584427 - 109.59)/(1 + (Math.abs(value)/12.20073) ** 1.190145))
    }
    return value;
}


export function toDbValueText (value) {
    let dB = toDbValue(value)
    dB = (dB === -Infinity) ? "-\u221E"  : dB + "dB";
    return  dB ;
}

export function equalPowerFader(value){
    value = (value + 50) / 100;
    return equalPower(value)
}

export function equalPower(percent){
    let volA = Math.cos(percent * 0.5 * Math.PI);
    let volB = Math.cos((1 - percent) * 0.5 * Math.PI);

    if(percent === 1){
        volA = 0;
        volB = 1;
    } else if(percent === 0){
        volA = 1;
        volB = 0;
    }

    return{
        a: volA,
        b: volB
    }
}