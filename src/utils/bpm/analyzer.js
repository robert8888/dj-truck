import { analyze, guess } from 'web-audio-beat-detector';

export function calcBpm(url){
    return fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
        const audioCtx = new AudioContext();
        return audioCtx.decodeAudioData(arrayBuffer);
    }).then( audioBuffer => analyze(audioBuffer))
    .catch(error => 0);
}

export function calcBpmAndOffset(url){
    return fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
        const audioCtx = new AudioContext();
        return audioCtx.decodeAudioData(arrayBuffer);
    }).then( audioBuffer => guess(audioBuffer))
    .catch(error => ({bpm: 0, offset:0 }))
}
