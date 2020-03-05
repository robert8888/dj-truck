
export function calcBpm(bpm, pitch){
    return (bpm * (1 + pitch / 100));
}