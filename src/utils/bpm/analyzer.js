import { analyze, guess } from "web-audio-beat-detector";
import {Logger, Log} from "../logger/logger";
import cacheFile from "./audioCache";


export function calcBpm(url) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      const audioCtx = new AudioContext();
      return audioCtx.decodeAudioData(arrayBuffer);
    })
    .then(audioBuffer => analyze(audioBuffer))
    .catch(error => 0);
}

export function calcBpmAndOffset(url) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      const audioCtx = new AudioContext();
      return audioCtx.decodeAudioData(arrayBuffer);
    })
    .then(audioBuffer => guess(audioBuffer))
    .catch(error => ({ bpm: 0, offset: 0 }));
}

export function calcAccurateBpmAndOffset(url, cache = false) {
  return fetch(url)
    .then(response => {
        if(cache)
            cacheFile(url, response.clone()).catch(err => {
                Logger.push(Log.Warning(["Bpm analyser", "caching local audio tracks"]))
            })
        return response.arrayBuffer()
    })
    .then(arrayBuffer => new AudioContext().decodeAudioData(arrayBuffer))
    .then(audioBuffer => Promise.all(
        [guess(audioBuffer), 
         analyze(audioBuffer)]
        ))
    .then( results => ({
        bpmRounded: results[0].bpm,
        offset: results[0].offset,
        bpm: results[1]
      }))
    .catch(error => ({
      bpm: 0,
      offset: 0,
      bpmRounded: 0, 
      err: error
    }));
}
