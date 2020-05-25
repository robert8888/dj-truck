
import { all } from "redux-saga/effects";
import loadtrack from "./catchLoadtrack";
import playback from "./catchPlayback";
import playtrack from "./catchPlaytrack";


export default function * tracklistRoot(){
    yield all([
        loadtrack(),
        playback(),
        playtrack(),
    ])
}