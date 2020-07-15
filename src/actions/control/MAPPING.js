import {
    setGain, setLow, setMid, setHi,
    setFilter, setFilterResonans,
    setCue, setSend, setFader,
    togglePlay, toggleCue,
    setLoop, setLoopLength,
    setPitch,
    setMaster, toggleSync,
    setDryWet, setCurrentEffect, setEffectParameter
} from '../';

export default {
    MIXER_CHANNEL_A_GAIN : {
        id : `MCG_A`,
        description: `Mixer channel A gain`,
        action: value => setGain("A", value)
    },
    MIXER_CHANNEL_B_GAIN : {
        id : `MCG_B`,
        description: `Mixer channel B gain`,
        action: value => setGain("B", value)
    },
    MIXER_CHANNEL_A_EQ_LOW : {
        id : `MCEL_A`,
        description: `Mixer channel A eq low`,
        action: value => setLow("A", value)
    },
    MIXER_CHANNEL_B_EQ_LOW : {
        id : `MCEL_B`,
        description: `Mixer channel B eq low`,
        action: value => setLow("B", value)
    },
    MIXER_CHANNEL_A_EQ_MID : {
        id : `MCEM_A`,
        description: `Mixer channel A eq mid`,
        action: value => setMid("A", value)
    },
    MIXER_CHANNEL_B_EQ_MID : {
        id : `MCEM_B`,
        description: `Mixer channel B eq mid`,
        action: value => setMid("B", value)
    },
    MIXER_CHANNEL_A_EQ_HI : {
        id : `MCEH_A`,
        description: `Mixer channel A eq high`,
        action: value => setHi("A", value)
    },
    MIXER_CHANNEL_B_EQ_HI : {
        id : `MCEH_B`,
        description: `Mixer channel B eq high`,
        action: value => setHi("B", value)
    },
    MIXER_CHANNEL_A_FILTER : {
        id: `MCF_A`,
        description: `Mixer channel A filter`,
        action: value => setFilter("A", value)
    },
    MIXER_CHANNEL_B_FILTER : {
        id: `MCF_B`,
        description: `Mixer channel B filter`,
        action: value => setFilter("B", value)
    },

    MIXER_CHANNEL_A_FILTER_RESONANCE : {
        id: `MCFR_A`,
        description: `Mixer channel A filter resonance`,
        action: value => setFilterResonans("A", value)
    },

    MIXER_CHANNEL_B_FILTER_RESONANCE : {
        id: `MCFR_B`,
        description: `Mixer channel B filter resonance`,
        action: value => setFilterResonans("B", value)
    },

    MIXER_CHANNEL_A_CUE : {
        id: `MCC_A`,
        description: `Mixer channel A cue`,
        action: value => setCue("A", value)
    },

    MIXER_CHANNEL_B_CUE : {
        id: `MCC_B`,
        description: `Mixer channel B cue`,
        action: value => setCue("B", value)
    },

    MIXER_CHANNEL_A_FX_1 : {
        id: `MCFX_A_1`,
        description: `Mixer channel A fx 1`,
        action: value => setSend("A", 1,value)
    },

    MIXER_CHANNEL_A_FX_2 : {
        id: `MCFX_A_2`,
        description: `Mixer channel A fx 2`,
        action: value => setSend("A", 2,value)
    },
    MIXER_CHANNEL_B_FX_1 : {
        id: `MCFX_B_1`,
        description: `Mixer channel B fx 1`,
        action: value => setSend("B", 1,value)
    },
    MIXER_CHANNEL_B_FX_2 : {
        id: `MCFX_B_2`,
        description: `Mixer channel B fx 2`,
        action: value => setSend("B", 2,value)
    },
    MIXER_FADER : {
        id: `MF`,
        description: `Mixer fader`,
        action: value => setFader(value),
    },

    //----- decks

    DECK_CHANNEL_A_PLAY : {
        id: "DCP_A",
        description: "Deck channel A play",
        action: (value) => togglePlay("A", value),
    },
    DECK_CHANNEL_B_PLAY : {
        id: "DCP_B",
        description: "Deck channel B play",
        action: (value) => togglePlay("B", value),
    },

    DECK_CHANNEL_A_CUE : {
        id: "DCC_A",
        description: "Deck channel A cue",
        action: (value) => toggleCue("A", value),
    },

    DECK_CHANNEL_B_CUE : {
        id: "DCC_B",
        description: "Deck channel B cue",
        action: (value) => toggleCue("B", value),
    },

    DECK_CHANNEL_A_LOOP_IN : {
        id: "DCLI_A",
        description : "Deck channel A loop in",
        action: value => setLoop("A", value)
    },

    DECK_CHANNEL_B_LOOP_IN : {
        id: "DCLI_B",
        description : "Deck channel B loop in",
        action: value => setLoop("B", value)
    },

    DECK_CHANNEL_A_LOOP_OUT : {
        id: "DCLO_A",
        description : "Deck channel A loop out",
        action: value => setLoop("A", false)
    },

    DECK_CHANNEL_B_LOOP_OUT : {
        id: "DCLO_B",
        description : "Deck channel B loop out",
        action: value => setLoop("B", false)
    },

    DECK_CHANNEL_A_LOOP_LENGTH : {
        id: "DCLL_A",
        description : "Deck channel A set loop length",
        action: value => setLoopLength("A", value)
    },

    DECK_CHANNEL_B_LOOP_LENGTH : {
        id: "DCLL_B",
        description : "Deck channel B set loop length",
        action: value => setLoopLength("B", value)
    },

    DECK_CHANNEL_A_PITCH : {
        id : "DCPT_A",
        description : "Deck channel A adjust pitch slider",
        action: value => setPitch("A", value)
    },

    DECK_CHANNEL_B_PITCH : {
        id : "DCPT_B",
        description : "Deck channel B adjust pitch slider",
        action: value => setPitch("B", value)
    },

    DECK_CHANNEL_A_SYNC : {
        id : "DCS_A",
        description : "Deck channel A sync",
        action: value => toggleSync("A", value)
    },

    DECK_CHANNEL_B_SYNC : {
        id : "DCS_B",
        description : "Deck channel B sync",
        action: value => toggleSync("B", value)
    },

    DECK_CHANNEL_A_MASTER : {
        id : "DCM_A",
        description : "Deck channel A set master",
        action: value => setMaster("A", value)
    },

    DECK_CHANNEL_B_MASTER : {
        id : "DCM_B",
        description : "Deck channel B set master",
        action: value => setMaster("B", value)
    },

    EFFECTOR_CHANNEL_1_DW:{
        id: "ECDW_1",
        description: "Effect channel 1 dry/wet",
        action: value => setDryWet(1, value)
    },

    EFFECTOR_CHANNEL_2_DW:{
        id: "ECDW_2",
        description: "Effect channel 2 dry/wet",
        action: value => setDryWet(2, value)
    },

    EFFECTOR_CHANNEL_1_EFFECT:{
        id: "ECE_1",
        description: "Changing current effect FX 1",
        action: value => setCurrentEffect(1, value)
    },

    EFFECTOR_CHANNEL_2_EFFECT:{
        id: "ECE_2",
        description: "Changing current effect FX 2",
        action: value => setCurrentEffect(2, value)
    },

    EFFECTOR_CHANNEL_1_EFFECT_PARAMETER_1:{
        id: "ECEP_1_1",
        description: "Adjust first effect parameter FX 1",
        action: value => setEffectParameter(1, null, 0, value)
    },

    EFFECTOR_CHANNEL_2_EFFECT_PARAMETER_1:{
        id: "ECEP_2_1",
        description: "Adjust first effect parameter FX 2",
        action: value => setEffectParameter(2, null, 0, value)
    },

    EFFECTOR_CHANNEL_1_EFFECT_PARAMETER_2:{
        id: "ECEP_1_2",
        description: "Adjust second effect parameter FX 1",
        action: value => setEffectParameter(1, null, 1, value)
    },

    EFFECTOR_CHANNEL_2_EFFECT_PARAMETER_2:{
        id: "ECEP_2_2",
        description: "Adjust second effect parameter FX 2",
        action: value => setEffectParameter(2, null, 1, value)
    },

    EFFECTOR_CHANNEL_1_EFFECT_PARAMETER_3:{
        id: "ECEP_1_3",
        description: "Adjust second effect parameter FX 1",
        action: value => setEffectParameter(1, null, 2, value)
    },

    EFFECTOR_CHANNEL_2_EFFECT_PARAMETER_3:{
        id: "ECEP_2_3",
        description: "Adjust second effect parameter FX 2",
        action: value => setEffectParameter(2, null, 2, value)
    },

    EFFECTOR_CHANNEL_1_EFFECT_PARAMETER_4:{
        id: "ECEP_1_4",
        description: "Adjust second effect parameter FX 1",
        action: value => setEffectParameter(1, null, 3, value)
    },

    EFFECTOR_CHANNEL_2_EFFECT_PARAMETER_4:{
        id: "ECEP_2_4",
        description: "Adjust second effect parameter FX 2",
        action: value => setEffectParameter(2, null, 3, value)
    },
}
