import { setCueEnable } from "./../../../../../actions";
import store from "./../../../../../store";
import { nodeChain as audioNodeChain } from "./../../../../../utils/sound/audioNodes";
import Cue from "./cue";
import Equaliztion from "./equalization";
import Fader from "./fader";
import Mastering from "./mastering";
import PeakMeters from "./peakMeters";
import Recorder from "./recorder/recorder";


export default class Mixer {
    constructor(channels) {
        this.config = store.getState().configuration.mixer;

        this.channels = channels;
        this.mastering = new Mastering(this);


        Object.assign(this, Equaliztion);
        Object.assign(this, Fader);
        Object.assign(this, PeakMeters);
        Object.assign(this, Cue);

        this.initChannelContainer('audioNodes');
        this.initChannelContainer('sampleBuffers');
        this.createMainChannel();

        this.recorder = new Recorder(this);
    }

    //connecting extrnal (effector)
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
        let main = this.audioNodes.channels['main'] = {};

        ac.destination.channelCount = Math.min(4, ac.destination.maxChannelCount);

        if (ac.destination.channelCount === 4) {
            this.isCueEnable = true;
            setTimeout(() => {
                store.dispatch(setCueEnable(true))
            }, 0)
        }

        main.preGainNode = ac.createGain();
        main.preAnalyserNode = ac.createAnalyser();
        main.compressorNode = ac.createDynamicsCompressor();
        main.postGainNode = ac.createGain();
        main.postAnalyserNode = ac.createAnalyser();

        //cue
        main.cueInput = ac.createGain();
        if (this.isCueEnable) {
            main.cueChannelMerger = ac.createChannelMerger(ac.destination.channelCount);

            main.cueChannelMerger.channelCountMode = "explicit";
            main.cueInput.channelCountMode = "explicit";
            main.cueInput.channelCount = ac.destination.channelCount;

            main.cueChannelMerger.connect(main.cueInput);
        }

        main.recorderStremDestination = ac.createMediaStreamDestination();
        main.postGainNode.connect(main.recorderStremDestination)


        this.mastering.configCompressor();

        //wiring in chain
        audioNodeChain([
            main.preGainNode,
            main.preAnalyserNode,
            main.compressorNode,
            main.postGainNode,
            main.postAnalyserNode,
            main.cueInput,
            ac.destination])
    }

    getChannelInterface(channelName) {
        return {
            getPeakMeter: () => this.getChannelPeakMeter(channelName),
        }
    }

    getMasteringInterface() {
        return {
            getPrePeakMeter: {
                getPeakMeter: this.getMasterPeakMetter.bind(this, "pre")
            },
            getPostPeakMeter: {
                getPeakMeter: this.getMasterPeakMetter.bind(this, "post")
            }

        }
    }

    setUpChannelsAudioNodes(channelName) {
        //surfer - waveSurfer obj
        let surfer = this.channels.getChannel(channelName)
        let audioCtx = surfer.backend.ac;

        //build aduio nodes after, below chain in this order
        this.audioNodes.channels[channelName] = {
            outputCueNode: audioCtx.createGain(),
            cue: {
                cueGainNode: audioCtx.createGain(),
                cueChannelSpliterNode: audioCtx.createChannelSplitter(2),
            },
            eqHiFilterNode: audioCtx.createBiquadFilter(),
            eqMidFilterNode: audioCtx.createBiquadFilter(),
            eqLowFilterNode: audioCtx.createBiquadFilter(),
            lowPassFilterNode: audioCtx.createBiquadFilter(),
            highPassFilterNode: audioCtx.createBiquadFilter(),
            //
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
        //-- Cue
        channelNodes.outputCueNode.connect(channelNodes.cue.cueGainNode);
        channelNodes.cue.cueGainNode.connect(channelNodes.cue.cueChannelSpliterNode);
        //connecting to main chanel
        if (this.isCueEnable) {
            const mainChannelNodes = this.audioNodes.channels['main']
            channelNodes.cue.cueChannelSpliterNode.connect(mainChannelNodes.cueChannelMerger, 0, 2);
            channelNodes.cue.cueChannelSpliterNode.connect(mainChannelNodes.cueChannelMerger, 1, 3);
        }
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
        channelNodes.lowPassFilterNode.type = "lowpass";
        channelNodes.lowPassFilterNode.frequency.setValueAtTime(24000, audioCtx.currentTime);

        channelNodes.highPassFilterNode.type = "highpass";
        channelNodes.highPassFilterNode.frequency.setValueAtTime(0, audioCtx.currentTime);
        //--Send and return
        channelNodes.sendAndReturns.forEach((channel) => {
            channelNodes.sendNode.connect(channel.send);
            //mute on start
            channel.send.gain.value = 0;
        });
        const sends = channelNodes.sendAndReturns.map(channel => channel.send);
        if (this.external && this.external.connect) {
            const returns = this.external.connect(sends);
            returns.forEach((returnNode, index) => {
                returnNode.gain.value = 0;
                channelNodes.sendAndReturns[index].return = returnNode;
                returnNode.connect(channelNodes.mainGainNode);
            })
        }

        //Assign in chain 
        this.channels.getChannel(channelName).backend.setFilters([
            channelNodes.outputCueNode,
            channelNodes.eqLowFilterNode,
            channelNodes.eqHiFilterNode,
            channelNodes.eqMidFilterNode,
            channelNodes.lowPassFilterNode,
            channelNodes.highPassFilterNode,
            channelNodes.sendNode,
            channelNodes.bypassNode,
            channelNodes.mainGainNode,
            channelNodes.analyserNode,
            channelNodes.faderVolumeNode,
        ])

        //-Conect to main output mixer channel
        surfer.backend.gainNode.disconnect();
        surfer.backend.gainNode.connect(
            this.audioNodes.channels['main'].preGainNode
        );
        this.setUpSampleBuffers(channelName);
    }

    setSend(channelName, sendNumber, value) {
        const sendAndReturns = this.audioNodes.channels[channelName].sendAndReturns;
        if (value === 1) {
            sendAndReturns._currentSends =
                (sendAndReturns._currentSends) ? sendAndReturns._currentSends.add(sendNumber) : new Set([sendNumber]);
        } else if (value === 0 && sendAndReturns._currentSends) {
            sendAndReturns._currentSends.delete(sendNumber);
        }

        let gain = 1;
        if (sendAndReturns._currentSends && sendAndReturns._currentSends.size > 1) {
            gain *= 0.71 ** (sendAndReturns._currentSends.size - 1);
        }

        sendAndReturns.forEach((channel, index) => {
            const { send, return: returns } = channel;
            //current sending
            if (sendAndReturns._currentSends.has(index)) {
                send.gain.setTargetAtTime(gain, this.mainAudioContext.currentTime, 0.01);
                returns.gain.setTargetAtTime(gain, this.mainAudioContext.currentTime, 0.01);
            } else {
                send.gain.setTargetAtTime(0, this.mainAudioContext.currentTime, 0.01);
                returns.gain.setTargetAtTime(0, this.mainAudioContext.currentTime, 0.01);
            }
        })

        //turn on/off bypass
        const bypass = +!sendAndReturns._currentSends.size;
        this.audioNodes.channels[channelName].bypassNode
            .gain.setTargetAtTime(bypass, this.mainAudioContext.currentTime, 0.01);
    }

}

