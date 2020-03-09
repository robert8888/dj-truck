import store from "./../../../store";


export default class Mixer{
    constructor(channels){
        this.config = store.getState().configuration.mixer;
        
        this.channels = channels;
        
        this.audioNodes = {
            channels : {
            }
        }

        this.sampleBuffers = {
            channels : {}
        }

        for(let channelName of this.channels.getChannelNames()){
            this.audioNodes.channels = { 
                ...this.audioNodes.channels,
                [channelName] : {},
            }

            this.sampleBuffers.channels = {
                ...this.sampleBuffers.channels,
                [channelName] : null,
            }
        }
    }

    getChannelInterface(channelName){
        return {
            getPeakMeter: () => this.getPeakMeter(channelName),
        }
    }



    setUpAudioNodes(channelName){
        let audioCtx = this.channels.getChannel(channelName).backend.ac;

        //chained from up to down 
        this.audioNodes.channels[channelName] = {
            analyserNode : audioCtx.createAnalyser(),
            faderVolumeNode : audioCtx.createGain(),
            gainNode : audioCtx.createGain(),
            eqHiFilterNode : audioCtx.createBiquadFilter(),
            eqMidFilterNode : audioCtx.createBiquadFilter(),
            eqLowFilterNode : audioCtx.createBiquadFilter(),

        }
        const channel = this.audioNodes.channels[channelName];
        //
        channel.analyserNode.fftSize = 256;
        //
        channel.eqLowFilterNode.type = "lowshelf";
        channel.eqLowFilterNode.frequency.setValueAtTime(this.config.low.frequency, audioCtx.currentTime);

        channel.eqHiFilterNode.type = "highshelf";
        channel.eqHiFilterNode.frequency.setValueAtTime(this.config.hi.frequency, audioCtx.currentTime);

        channel.eqMidFilterNode.type = "peaking";
        channel.eqMidFilterNode.frequency.setValueAtTime(this.config.mid.frequency, audioCtx.currentTime);
        channel.eqMidFilterNode.Q.setValueAtTime(this.config.mid.Q, audioCtx.currentTime);  

        //last in array is firt in chain (on top)
        this.channels.getChannel(channelName).backend.setFilters([
            channel.eqLowFilterNode, 
            channel.eqMidFilterNode, 
            channel.eqHiFilterNode, 
            channel.gainNode,
            channel.analyserNode,
            channel.faderVolumeNode,

         ])
        
        this.setUpSampleBuffers(channelName);
    }
    
    setUpSampleBuffers(channelName){
        let fftSize = this.audioNodes.channels[channelName].analyserNode.fftSize;
        this.sampleBuffers.channels[channelName] = new Float32Array(fftSize);
    }


    setGainValue(channelName, knobValue, nodeName){
        let gain = 1 + knobValue / 100 ;
        let audioCtx = this.channels.getChannel(channelName).backend.ac;

        let channel = this.audioNodes.channels[channelName];
        channel[nodeName].gain.setTargetAtTime( parseFloat(gain) , audioCtx.currentTime, 0.01);
    }

    setFilterValue(channelName, knobValue, nodeName){
        let audioCtx = this.channels.getChannel(channelName).backend.ac;

        let channel = this.audioNodes.channels[channelName];
        channel[nodeName].gain.setValueAtTime( knobValue , audioCtx.currentTime);
    }


    setGain(channelName, knobValue){
        this.setGainValue(channelName, knobValue, 'gainNode');
    }

    setEqHigh(channelName, knobValue){
        this.setFilterValue(channelName, knobValue, 'eqHiFilterNode');
    }

    setEqMid(channelName, knobValue){
        this.setFilterValue(channelName, knobValue, 'eqMidFilterNode');
    }

    setEqLow(channelName, knobValue){
        this.setFilterValue(channelName, knobValue, 'eqLowFilterNode');
    }

    setFader(value){//in procent from -50%  to + 50% (not 0.01) but 1
        let faderVolumeNodeA = this.audioNodes.channels["A"].faderVolumeNode;
        let faderVolumeNodeB = this.audioNodes.channels["B"].faderVolumeNode;
        let audioCtxA = this.channels.getChannel("A").backend.ac;
        let audioCtxB = this.channels.getChannel("B").backend.ac;
        if(!faderVolumeNodeA || !faderVolumeNodeB || !audioCtxA || !audioCtxB){
            throw new Error("Fased value not set checkout funtion setFader in mixer object");
        }

        let percent = (value + 50)/100;
        let volA = Math.cos(percent * 0.5 * Math.PI);
        let volB = Math.cos((1 - percent) * 0.5 * Math.PI);

        faderVolumeNodeA.gain.setTargetAtTime(volA, audioCtxA.currentTime, 0.01);
        faderVolumeNodeB.gain.setTargetAtTime(volB, audioCtxB.currentTime, 0.01);
    }



    getPeakMeter(channelName){
        if(!this.audioNodes?.channels[channelName]?.analyserNode) return [];
        let sampleBuffer = this.sampleBuffers.channels[channelName]
        this.audioNodes.channels[channelName].analyserNode.getFloatTimeDomainData(sampleBuffer);
       
        //average 
        let sumOfSquares = 0;
        for (let i = 0; i < sampleBuffer.length; i++) {
          sumOfSquares += sampleBuffer[i] ** 2;
        }

        const avgPowerDecibels = 10 * Math.log10(sumOfSquares / sampleBuffer.length);

        //peak 

        let peakPower = 0;
        for (let i = 0; i < sampleBuffer.length; i++) {
          const power = sampleBuffer[i] ** 2;
          peakPower = Math.max(power, peakPower);
        }
        const peakPowerDecibels = 10 * Math.log10(peakPower);

        return {
            avgdB : avgPowerDecibels,
            peakdB : peakPowerDecibels,
        }
    }
    
}

