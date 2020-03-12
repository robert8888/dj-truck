const STATUS = {
    TRACK_LOADED : "Fire when track is loaded to deck",
    TOGGLE_PLAY : "Fire when puased state was changed",
    TOGGLE_CUE : "Fire when cueActive state was changed",
    PITCH_CHANGE : "Fire when pitch was changed",
    GAIN_CHANGE : "Fire when gain of mixer channels was changed",
    EQ_HI_CHANGE : "Fire when equalization higest band was changed",
    EQ_MID_CHANGE : "Fire when equalization mid band was changed",
    EQ_LOW_CHANGE : "Fire when equalization lowest band was changed",
    FADER_CHANGE: "Fire when value of fader postion was chaged",
    SYNC_ACTIVATE: "When one of channels has sync on"
}

export default STATUS;