const STATUS = {
    TRACK_LOADED : "Fire when track is loaded to deck",
    TOGGLE_PLAY : "Fire when paused state was changed",
    TOGGLE_CUE : "Fire when cueActive state was changed",
    PITCH_CHANGE : "Fire when pitch was changed",
    GAIN_CHANGE : "Fire when gain of mixer channels was changed",
    VOLUME_CHANGE: "Fire when volume of mixer channel was changed",
    EQ_HI_CHANGE : "Fire when equalization highest band was changed",
    EQ_MID_CHANGE : "Fire when equalization mid band was changed",
    EQ_LOW_CHANGE : "Fire when equalization lowest band was changed",
    FILTER_CHANGE : "Fire when mixer filter value change",
    FILTER_RES_CHANGE : "Filter mixer filter resonance value change",
    FADER_CHANGE: "Fire when value of fader position was changed",
    SYNC_ACTIVATE: "When one of channels has sync on",
    BPM_AND_OFFSET_READY : "Fire when bpm and offset on channel is loaded",
    LOOP_CHANGE : "Fire when loop state is change on channel",
    LOOP_LENGTH_CHANGE : "Fire when loopLength is changed during a looped track",
    SEND_CHANGE : "Fire when mixer send is changed",
    CUE_CHANGE: "Fire wen cue value on mixer channel was changed",
    ZOOM_CHANGE: "Fire when deck zoom was changed",

    DRY_WET_CHANGED : "Fire when dry wet parent was changed on effector channel",
    CURRENT_EFFECT_CHANGED: "Fire when current effect for effector channel is changed",
    EFFECT_PARAM_CHANGED: "Fire when parameter of effect was changed",

    MASTERING: "General status for changes in mastering  section",
    MASTER_PRE_GAIN_CHANGE: "Mastering pre gain value changed",
    MASTER_POST_GAIN_CHANGE: "Mastering post gain value changed",
    MASTER_THRESHOLD_CHANGE: "Mastering threshold value changed",
    MASTER_RATIO_CHANGE: "Mastering ratio value changed",
    MASTER_ATTACK_CHANGE: "Mastering attack value changed",
    MASTER_RELEASE_CHANGE: "Mastering release value changed",

    RECORDER : "General status for changes in recorder reducer",
    RECORD_START: "Record started with id and recName",
    RECORD_END: "Record was stopped with id and name",

    MIDI_PORT_CHANGE: "Fire when midi port is changed"
}

export default STATUS;