
import store from "./../../../../../store";
import { setAvailableEffects } from "./../../../../../actions";
import { equalPower } from "./../../../../../utils/sound/converter"
//import { throttel } from "./../../../../../utils/functions/lodash";
import Reverb from "./effects/reverb/reverb";
import Delay from "./effects/delay/delay";



export default class Effector {
    constructor(audioContext) {
        this.config = store.getState().configuration.effector;
        this.mainAC = audioContext;

        this.buildChannels(this.config.channels);


        this.effects = {
            "reverb": {
                create: Reverb,
                params: Reverb.defaultParams().params,
            },
            "delay": {
                create: Delay,
                params: Delay.defaultParams().params
            }
        }

        const exportEffects = {};
        Object.entries(this.effects).forEach(([key, element]) =>
            exportEffects[key] = element.params
        );
        store.dispatch(setAvailableEffects(exportEffects));
    }

    buildChannels(channelNumber) {
        this.channels =
            Array.from({ length: channelNumber }, ( _ , index) => ({ channelNumber: index }));

        for (let chNum = 0; chNum < channelNumber; chNum++) {
            const channel = this.channels[chNum];

            channel.inputNode = this.mainAC.createGain();
            channel.dryNode = this.mainAC.createGain();;
            channel.wetNode = this.mainAC.createGain();
            channel.outputNode = this.mainAC.createGain();

            channel.inputNode.connect(channel.dryNode);
            channel.inputNode.connect(channel.wetNode);
            channel.dryNode.connect(channel.outputNode);
            channel.wetNode.connect(channel.outputNode);

            channel.wetNode.gain.setValueAtTime(0,0)
        }
    }

    connect(inputs) {   
        const outputs = [];
        
        inputs.forEach((inputNode, chNum) => {
            inputNode.connect(this.channels[chNum].inputNode);
            
            const output = this.mainAC.createGain();
            this.channels[chNum].outputNode.connect(output);
            outputs.push(output)
        });
    
        return outputs;
    }


    setDryWet(channelNumber, value) {
        channelNumber--;
        const channel = this.channels[channelNumber];

      //  const {a: dry, b: wet} = equalPower(value / 100);
        let dry = (100 - value) / 100;
        let wet = value / 100;

        console.log("dry " + dry, "Wet "+ wet )

        channel.dryNode.gain.setTargetAtTime(dry, this.mainAC.currentTime, 0.01);
        channel.wetNode.gain.setTargetAtTime(wet, this.mainAC.currentTime, 0.01);
    }

    setEffect(channelNumber, effectName) {
        channelNumber--;//array index
        const channel = this.channels[channelNumber];

        if (effectName) {
            this.disconectCurrent(channel);

            let params = this.assingDefaultParams({}, effectName);

            const effectorChannel = store.getState().effector.channels;

            if (effectorChannel && effectorChannel[channelNumber]) {
                params = { ...effectorChannel[channelNumber].effects[effectName] }
            }

            const effect = new this.effects[effectName].create(this.mainAC, params);

            channel.currentEffect = effect;
            channel.inputNode.connect(channel.dryNode)

            effect.connect(channel.inputNode, channel.wetNode)

        } else {
            this.disconectCurrent(channel);
        }

    }

    assingDefaultParams(obj, effect) {
        Object.entries(this.effects[effect].params).forEach(([key, value]) => {
            obj[key] = value.defaultValue;
        })
        return obj;
    }

    setParam(channelNumber, effect, param) {
        channelNumber--;
        const channel = this.channels[channelNumber];
        if (channel.currentEffect && channel.currentEffect.name === effect) {
            Object.entries(param).forEach(([key, value]) => {
                channel.currentEffect[key] = value;
            })
        }
    }


    disconectCurrent(channel) {
        if (channel.currentEffect) {
            channel.inputNode.disconnect();
            channel.inputNode.connect(channel.dryNode);
            channel.inputNode.connect(channel.wetNode);
            channel.currentEffect.disconnect();
            channel.currentEffect = null;
        }
    }
}