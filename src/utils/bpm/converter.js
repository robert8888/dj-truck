
export function calcBpm(bpm, pitch){
    return (bpm * (1 + pitch / 100));
}

export function getBeatLength(bpm){
    return 60/bpm; 
}