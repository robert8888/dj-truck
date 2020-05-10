
import { all} from "redux-saga/effects"

import loadtrack from "./loadtrack";
import playback from "./playback";
import playtrack from "./playtrack";

export default function * tracklistRoot(){
    yield all([
        loadtrack(),
        playback(),
        playtrack(),
    ])
}