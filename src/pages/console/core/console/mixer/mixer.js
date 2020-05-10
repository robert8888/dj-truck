import store from "./../../../../../store";
import { nodeChain as audioNodeChain } from "./../../../../../utils/sound/audioNodes";
import Mastering from "./mastering";
import Recorder from "./recorder/recorder";
import Equaliztion from "./equalization";
import Fader from "./fader";
import PeakMeters from "./peakMeters";

export default class Mixer {
    constructor(channels) {
        this.config = store.getState().configuration.mixer;

        this.channels = channels;
        this.mastering = new Mastering(this);

        
        Object.assign(this, Equaliztion);
        Object.assign(this, Fader);
        Object.assign(this, PeakMeters)

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

        main.preGainNode = ac.createGain();
        main.preAnalyserNode = ac.createAnalyser();
        main.compressorNode = ac.createDynamicsCompressor();
        main.postAnalyserNode = ac.createAnalyser();
        main.postGainNode = ac.createGain();

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
         ac.destination])
    }


    getChannelInterface(channelName) {
        return {
            getPeakMeter: () => this.getChannelPeakMeter(channelName),
        }
    }

    getMasteringInterface(){
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

        //chained from up to down 
        this.audioNodes.channels[channelName] = {
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
            console.log("for channek " + channelName, " gain " + gain, "send nubmer " + sendNumber)
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

