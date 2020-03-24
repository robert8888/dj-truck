
import store from "./../../../../../store";
import { setAvailableEffects } from "./../../../../../actions";
//import { throttel } from "./../../../../../utils/functions/lodash";
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
        Object.entries(this.effects).forEach(([key, element]) =>
                exportEffects[key] = element.params
            );
        store.dispatch(setAvailableEffects(exportEffects));
    }

    connect(inputs) {
        const outputs = inputs.map(() => this.mainAC.createGain())

        inputs.forEach((inputNode, channelNumber) => {
            const dryNode = this.mainAC.createGain();
            const wetNode = this.mainAC.createGain();
            
          //  inputNode.connect(dryNode);
            dryNode.connect(outputs[channelNumber]);
            wetNode.connect(outputs[channelNumber]);

            this.channels[channelNumber].inputNode = inputNode;
            this.channels[channelNumber].dryNode = dryNode;
            this.channels[channelNumber].wetNode = wetNode;
            this.channels[channelNumber].outputNode = outputs[channelNumber];


        });

        return outputs;
    }


    setDryWet(channelNumber, value){
        channelNumber--;
        console.log("set dry wet", channelNumber + " val:", value);
        const channel = this.channels[channelNumber];
        channel.dryNode.gain.setTargetAtTime(0, this.mainAC.currentTime, 0.01);
    }
       
    setEffect(channelNumber, effectName){ 
        channelNumber--;//array index
        const channel = this.channels[channelNumber];
       


        if(effectName){
            let params = this.assingDefaultParams({}, effectName);
     
            const effectorChannel = store.getState().effector.channels;

            if(effectorChannel && effectorChannel[channelNumber]){
                params = {...effectorChannel[channelNumber].effects[effectName]}
            }

            const effect = new this.effects[effectName].create(this.mainAC, params);

            channel.currentEffect = effect;
            console.log("connecting",channelNumber,  channel, effect)
            channel.inputNode.connect(channel.dryNode)

            effect.connect(channel.inputNode, channel.wetNode)

        } else {
            //remove effect
        }

      //  const params = {...channelEffects[effect]};
      //  console.log(params);
        //
    }

    assingDefaultParams(obj, effect){
        Object.entries(this.effects[effect].params).forEach(([key, value])=>{
            obj[key] = value.defaultValue;
        })
        return obj;
    }

    setParam(channelNumber, effect, param){
        //console.log("set param : "+ channelNumber, "effect: " + effect, " pram: " + JSON.stringify(param));
        channelNumber--;
        const channel = this.channels[channelNumber];
        if(channel.currentEffect && channel.currentEffect.name === effect){
            Object.entries(param).forEach(([key, value])=>{
                channel.currentEffect[key] = value;
            })
        }
    }


    disconectCurrent(channel){
        if(!channel.currentEffect){
            channel.inputNode.disconect();
            channel.inputNode.connect(channel.dryNode);
            channel.currentEffect.disconect();
            channel.currentEffect = null;
        }
    }
}