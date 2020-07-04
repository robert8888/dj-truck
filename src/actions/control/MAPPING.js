import {setCue, setFader, setFilter, setFilterResonans, setGain, setHi, setLow, setMid, setSend} from "..";

export default {
    MIXER_CHANNEL_GAIN : (channel) => ({
        id: "MCG-"+channel,
        description: `Mixer channel ${channel} gain`,
        resolver: value => setGain(channel, value)
    }),
    MIXER_CHANNEL_EQ_LOW : (channel) => ({
        id: "MCEL-"+channel,
        description: `Mixer channel ${channel} eq low`,
        resolver: value => setLow(channel, value)
    }),
    MIXER_CHANNEL_EQ_MID : (channel) => ({
        id: "MCEM-"+channel,
        description: `Mixer channel ${channel} mid low`,
        resolver: value => setMid(channel, value)
    }),
    MIXER_CHANNEL_EQ_HI : (channel) => ({
        id: "MCEH-"+channel,
        description: `Mixer channel ${channel} hi low`,
        resolver: value => setHi(channel, value)
    }),
    MIXER_CHANNEL_FILTER : (channel) => ({
        id: "MCF-"+channel,
        description : `Mixer channel ${channel} filter`,
        resolver : value =>  setFilter(channel, value)
    }),
    MIXER_CHANNEL_RESONANCE : (channel) => ({
        id: "MCR-"+channel,
        description : `Mixer channel ${channel} resonance`,
        resolver : value =>  setFilterResonans(channel, value)
    }),

    MIXER_CHANNEL_CUE : (channel) => ({
        id: "MCC-"+channel,
        description : `Mixer channel ${channel} cue`,
        resolver : value =>  setCue(channel, value)
    }),

    MIXER_CHANNEL_FX : (channel, send) => ({
        id: `MCFX-${send}-${channel}`,
        description : `Mixer channel ${channel} fx ${send}`,
        resolver : value =>  setSend(channel, send, value)
    }),

    MIXER_FADER : {
        id: "MF",
        description : `Mixer fader`,
        resolver : value =>  setFader(value)
    },
}