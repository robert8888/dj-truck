import store from "./../../../store";


export default class Mixer {
    constructor(channels) {

        this.config = store.getState().configuration.mixer;

        this.channels = channels;

        this.initChannelContainer('audioNodes');
        this.initChannelContainer('sampleBuffers');
        this.createMainChannel();
    }

    connect(external) {
        this.external = external;
    }

    initChannelContainer(containerName) {
        this[containerName] = {
            channels: {
            }
        }
        for (let channelName of [...this.channels.getChannelNames(), "main"]) {
            this[containerName].channels = {
                ...this[containerName].channels,
                [channelName]: null
            }
        }
    }

    createMainChannel() {
        //main audio context with is share between wavesurfer objects
        this.mainAudioContext = new AudioContext();

        let ac = this.mainAudioContext;
        let main = this.audioNodes.channels['main'];
        main = {};

        main.gainNode = ac.createGain();
        main.analyserNode = ac.createAnalyser();
        main.gainNode.connect(main.analyserNode);
        main.analyserNode.connect(ac.destination);
    }


    getChannelInterface(channelName) {
        return {
            getPeakMeter: () => this.getPeakMeter(channelName),
        }
    }



    setUpChannelsAudioNodes(channelName) {
        //surfer - waveSurfer obj
        let surfer = this.channels.getChannel(channelName)
        let audioCtx = surfer.backend.ac;

        //chained from up to down 
        this.audioNodes.channels[channelName] = {
            eqHiFilterNode: audioCtx.createBiquadFilter(),
            eqMidFilterNode: audioCtx.createBiquadFilter(),
            eqLowFilterNode: audioCtx.createBiquadFilter(),
            //low pass to do
            //hi pass to do
            sendNode: audioCtx.createGain(),
            sendAndReturns: Array(this.config.externalChannels).fill(1).map(() => ({
                send: audioCtx.createGain(),
                return: null
            })),
            //
            bypassNode: audioCtx.createGain(),
            mainGainNode: audioCtx.createGain(),
            analyserNode: audioCtx.createAnalyser(),
            faderVolumeNode: audioCtx.createGain(),
        }

        //--Confign
        const channelNodes = this.audioNodes.channels[channelName];
        //
        channelNodes.analyserNode.fftSize = 256;
        //--EQ filters
        channelNodes.eqLowFilterNode.type = "lowshelf";
        channelNodes.eqLowFilterNode.frequency.setValueAtTime(this.config.low.frequency, audioCtx.currentTime);

        channelNodes.eqHiFilterNode.type = "highshelf";
        channelNodes.eqHiFilterNode.frequency.setValueAtTime(this.config.hi.frequency, audioCtx.currentTime);

        channelNodes.eqMidFilterNode.type = "peaking";
        channelNodes.eqMidFilterNode.frequency.setValueAtTime(this.config.mid.frequency, audioCtx.currentTime);
        channelNodes.eqMidFilterNode.Q.setValueAtTime(this.config.mid.Q, audioCtx.currentTime);
        //--Filters

        //--Send and return
        channelNodes.sendAndReturns.forEach( channel => {
            channelNodes.sendNode.connect(channel.send);
        });
        const sends = channelNodes.sendAndReturns.map(channel => channel.send);
        if (this.external && this.external.connect) {
            const returns = this.external.connect(sends);
            returns.forEach((returnNode, index)=>{
                channelNodes.sendAndReturns[index].return = returnNode;
                returnNode.connect(channelNodes.mainGainNode);
            })
        }


        //Assign in chain 
        this.channels.getChannel(channelName).backend.setFilters([
            channelNodes.eqLowFilterNode,
            channelNodes.eqHiFilterNode,
            channelNodes.eqMidFilterNode,
            channelNodes.sendNode,
            channelNodes.bypassNode,
            channelNodes.mainGainNode,
            channelNodes.analyserNode,
            channelNodes.faderVolumeNode,
        ])

        //-Conect to main output mixer channel
        surfer.backend.gainNode.disconnect();
        surfer.backend.gainNode.connect(this.mainAudioContext.destination);

        this.setUpSampleBuffers(channelName);
    }



    setGainValue(channelName, knobValue, nodeName) {
        let gain = 1 + knobValue / 100;
        let audioCtx = this.channels.getChannel(channelName).backend.ac;

        let channel = this.audioNodes.channels[channelName];
        channel[nodeName].gain.setTargetAtTime(parseFloat(gain), audioCtx.currentTime, 0.01);
    }

    setFilterValue(channelName, knobValue, nodeName) {
        let audioCtx = this.channels.getChannel(channelName).backend.ac;

        let channel = this.audioNodes.channels[channelName];
        channel[nodeName].gain.setValueAtTime(knobValue, audioCtx.currentTime);
    }


    setGain(channelName, knobValue) {
        this.setGainValue(channelName, knobValue, 'mainGainNode');
    }

    setEqHigh(channelName, knobValue) {
        this.setFilterValue(channelName, knobValue, 'eqHiFilterNode');
    }

    setEqMid(channelName, knobValue) {
        this.setFilterValue(channelName, knobValue, 'eqMidFilterNode');
    }

    setEqLow(channelName, knobValue) {
        this.setFilterValue(channelName, knobValue, 'eqLowFilterNode');
    }



    setFader(value) {//in procent from -50%  to + 50% (not 0.01) but 1
        let faderVolumeNodeA = this.audioNodes.channels["A"].faderVolumeNode;
        let faderVolumeNodeB = this.audioNodes.channels["B"].faderVolumeNode;
        let audioCtxA = this.channels.getChannel("A").backend.ac;
        let audioCtxB = this.channels.getChannel("B").backend.ac;

        if (!faderVolumeNodeA || !faderVolumeNodeB || !audioCtxA || !audioCtxB) {
            throw new Error(`Fader value not set. Mising auiodContext or AudioNode ref
                            .Checkout funtion setFader in mixer object`);
        }

        let percent = (value + 50) / 100;
        let volA = Math.cos(percent * 0.5 * Math.PI);
        let volB = Math.cos((1 - percent) * 0.5 * Math.PI);

        faderVolumeNodeA.gain.setTargetAtTime(volA, audioCtxA.currentTime, 0.01);
        faderVolumeNodeB.gain.setTargetAtTime(volB, audioCtxB.currentTime, 0.01);
    }


    setUpSampleBuffers(channelName) {
        let fftSize = this.audioNodes.channels[channelName].analyserNode.fftSize;
        this.sampleBuffers.channels[channelName] = new Float32Array(fftSize);
    }

    getPeakMeter(channelName) {
        let analyser = this.audioNodes?.channels[channelName]?.analyserNode
        if (!analyser) {
            return [];
        }
        let sampleBuffer = this.sampleBuffers.channels[channelName];
        if (!sampleBuffer) {
            return [];
        }
        return this.getPeakData(analyser, sampleBuffer)
    }

    getPeakData(analyser, sampleBuffer) {
        analyser.getFloatTimeDomainData(sampleBuffer);

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
            avgdB: avgPowerDecibels,
            peakdB: peakPowerDecibels,
        }
    }

}

