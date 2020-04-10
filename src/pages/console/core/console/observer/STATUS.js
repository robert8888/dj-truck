const STATUS = {
    TRACK_LOADED : "Fire when track is loaded to deck",
    TOGGLE_PLAY : "Fire when puased state was changed",
    TOGGLE_CUE : "Fire when cueActive state was changed",
    PITCH_CHANGE : "Fire when pitch was changed",
    GAIN_CHANGE : "Fire when gain of mixer channels was changed",
    EQ_HI_CHANGE : "Fire when equalization higest band was changed",
    EQ_MID_CHANGE : "Fire when equalization mid band was changed",
    EQ_LOW_CHANGE : "Fire when equalization lowest band was changed",
    FILTER_CHANGE : "Fiter when mixer filter value change",
    FILTER_RES_CHANGE : "Fiter mixer filter resonas value change", 
    FADER_CHANGE: "Fire when value of fader postion was chaged",
    SYNC_ACTIVATE: "When one of channels has sync on",
    BPM_AND_OFFSET_READY : "Fire when bpm and offset on channel is loaded",
    LOOP_CHANGE : "Fire when loop state is change on channel",
    LOOP_LENGTH_CHANGE : "Fire when loopLength is changed durring a looped track",
    SEND_CHANGE : "Fire when mixer send is changed",

    DRY_WET_CHANGED : "Fire when dry wet paramet was changed on effector channel",
    CURRENT_EFFECT_CHANGED: "Fire when current effect for effector channel is changed",
    EFFECT_PARAM_CHANGED: "Firew when parameter of effect was changed",

    MASTERING: "General status for changes in mastering  seciton",
    MASTER_PRE_GAIN_CHANGE: "Mastering pre gain value changed",
    MASTER_POST_GAIN_CHANGE: "Mastering post gain value changed",
    MASTER_THRESHOLD_CHANGE: "Mastering threshold value changed",
    MASTER_RATIO_CHANGE: "Mastering ratio value changed",
    MASTER_ATTACK_CHANGE: "Mastering attack value changed",
    MASTER_RELEASE_CHANGE: "Mastering release value changed"
}

export default STATUS;