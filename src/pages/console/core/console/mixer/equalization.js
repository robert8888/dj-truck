const Equaliztion = {

    setGainValue(channelName, knobValue, nodeName) {
        let gain = 1 + knobValue / 100;
        let audioCtx = this.channels.getChannel(channelName).backend.ac;

        let channel = this.audioNodes.channels[channelName];
        channel[nodeName].gain.setTargetAtTime(parseFloat(gain), audioCtx.currentTime, 0.01);
    },

    setFilterValue(channelName, knobValue, nodeName) {
        let audioCtx = this.channels.getChannel(channelName).backend.ac;

        let channel = this.audioNodes.channels[channelName];
        channel[nodeName].gain.setValueAtTime(knobValue, audioCtx.currentTime);
    },

    setGain(channelName, knobValue) {
        this.setGainValue(channelName, knobValue, 'mainGainNode');
    },

    setEqHigh(channelName, knobValue) {
        this.setFilterValue(channelName, knobValue, 'eqHiFilterNode');
    },

    setEqMid(channelName, knobValue) {
        this.setFilterValue(channelName, knobValue, 'eqMidFilterNode');
    },

    setEqLow(channelName, knobValue) {
        this.setFilterValue(channelName, knobValue, 'eqLowFilterNode');
    },

    setFilterFreq(channelName, knobValue) {
       // knobValue *= 800;
        const channel = this.audioNodes.channels[channelName];
        if (knobValue < 0) {
            //low pass
            const freq = 8000 - (Math.log10(Math.abs(knobValue)) * 8000);
            channel.lowPassFilterNode.frequency
                .setValueAtTime(freq, this.mainAudioContext.currentTime);

            channel.highPassFilterNode.frequency
                .setValueAtTime(0, this.mainAudioContext.currentTime);
            setFilterRes.call(this, channel, channel._fitlerResonasValue);
        } else if (knobValue > 0) {
            // high pass filter
            channel.lowPassFilterNode.frequency
                .setValueAtTime(24000, this.mainAudioContext.currentTime);

            knobValue = Math.E ** knobValue;//
            channel.highPassFilterNode.frequency
                .setValueAtTime(knobValue, this.mainAudioContext.currentTime);

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

    setFiterResonas(channelName, knobValue) {
        const channel = this.audioNodes.channels[channelName];
        channel._fitlerResonasValue = knobValue;
    },
}

export default Equaliztion;