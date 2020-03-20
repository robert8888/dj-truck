
import store from "./../../../../../store";
import { setAvailableEffects } from "./../../../../../actions";

import Reverb from "./effects/reverb/reverb";
import Delay from "./effects/delay/delay";



export default class Effector {
    constructor(audioContext) {
        this.config = store.getState().configuration.effector;
        this.mainAC = audioContext;

        this.channels = new Array(this.config.channels)
            .fill(null).map(() => Object.create(null));
        
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
        Object.entries(this.effects).forEach(([key, element]) => exportEffects[key] = element.params);
        store.dispatch(setAvailableEffects(exportEffects));
    }

    connect(inputs) {
        const outputs = inputs.map(() => this.mainAC.createGain())

        inputs.forEach((inputNode, channelNumber) => {
            const dryNode = this.mainAC.createGain();

            inputNode.connect(dryNode);
            dryNode.connect(outputs[channelNumber]);

            this.channels[channelNumber].inputNode = inputNode;
            this.channels[channelNumber].dryNode = dryNode;
            this.channels[channelNumber].outputNode = outputs[channelNumber];
        });

        return outputs;
    }
}