import {toGainCurve} from "../../../../../utils/sound/converter";

const Equaliztion = {

    setGainValue(channelName, value, nodeName) {
        let gain = 1 + value / 100;
        let audioCtx = this.channels.getChannel(channelName).backend.ac;

        let channel = this.audioNodes.channels[channelName];
        channel[nodeName].gain.setTargetAtTime(parseFloat(gain), audioCtx.currentTime, 0.01);
    },

    setFilterValue(channelName, value, nodeName) {
        let audioCtx = this.channels.getChannel(channelName).backend.ac;

        let channel = this.audioNodes.channels[channelName];
        channel[nodeName].gain.setValueAtTime(value, audioCtx.currentTime);
    },

    setGain(channelName, value) {
        this.setGainValue(channelName, value, 'mainGainNode');
    },

    setVolume(channelName, value){
        this.setGainValue(channelName, toGainCurve(value), 'volumeNode');
    },

    setEqHigh(channelName, value) {
        this.setFilterValue(channelName, value, 'eqHiFilterNode');
    },

    setEqMid(channelName, value) {
        this.setFilterValue(channelName, value, 'eqMidFilterNode');
    },

    setEqLow(channelName, value) {
        this.setFilterValue(channelName, value, 'eqLowFilterNode');
    },

    setFilterFreq(channelName, value) {
       // knobValue *= 800;
        const channel = this.audioNodes.channels[channelName];
        if (value < 0) {
            //low pass
            const freq = 8000 - (Math.log10(Math.abs(value)) * 8000);
            channel.lowPassFilterNode.frequency
                .setValueAtTime(freq, this.mainAudioContext.currentTime);

            channel.highPassFilterNode.frequency
                .setValueAtTime(0, this.mainAudioContext.currentTime);
            setFilterRes.call(this, channel, channel._fitlerResonasValue);
        } else if (value > 0) {
            // high pass filter
            channel.lowPassFilterNode.frequency
                .setValueAtTime(24000, this.mainAudioContext.currentTime);

            value = Math.E ** value;//
            channel.highPassFilterNode.frequency
                .setValueAtTime(value, this.mainAudioContext.currentTime);

            setFilterRes.call(this, channel, channel._fitlerResonasValue);
        } else {
            //0 turn of all
            channel.lowPassFilterNode.frequency
                .setValueAtTime(24000, this.mainAudioContext.currentTime);

            channel.highPassFilterNode.frequency
                .setValueAtTime(0, this.mainAudioContext.currentTime);
                
            setFilterRes.call(this, channel, 0);
        }

        function setFilterRes(channel, value = 0) {
            channel.lowPassFilterNode.Q
                .setValueAtTime(value, this.mainAudioContext.currentTime);

            channel.highPassFilterNode.Q
                .setValueAtTime(value, this.mainAudioContext.currentTime);
        }
    },

    setFiterResonas(channelName, value) {
        const channel = this.audioNodes.channels[channelName];
        channel._fitlerResonasValue = value;
    },
}

export default Equaliztion;