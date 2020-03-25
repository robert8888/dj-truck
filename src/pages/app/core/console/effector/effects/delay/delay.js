import Effect from "./../effect";
import {toRange} from "./../../../../../../../utils/math/argRanges";

export default class Delay extends Effect {
    static defaultParams(){
        return {
            params : {
                feedback: {
                    min: 0,
                    max: 100,
                    defaultValue: 50,
                    type: "float",
                    description : "fb"
                },
                time: {
                    min: 0,
                    max: 180,
                    defaultValue: 5,
                    type: "float",
                    description: "time"
                },
            }
        }
    }

    constructor(context, params){
        super();
        this.dParams = Delay.defaultParams().params;
        this._time = params.time || this.dParams.time.defaultValue;
        this._feedback = params.feedback || this.dParams.feedback.defaultValue;
        this.context = context;

        this.inputNode = context.createGain();
        this.outputNode = context.createGain();
        this.feedbackGainNode = context.createGain();
        this.delayNode = context.createDelay();
        
        //config
        this.feedbackGainNode.gain.value = this.feedback/100 ;
        this.delayNode.delayTime.value = this.time;

        // line in to wet mix
        this.inputNode.connect(this.delayNode);

        // feedback loop
        this.delayNode.connect(this.feedbackGainNode);
        this.feedbackGainNode.connect(this.delayNode);

        // wet out
        this.delayNode.connect(this.outputNode);
    }

    connect(input, dest){
        input.connect(this.inputNode);
        this.outputNode.connect(dest);

        console.log(this)
    }

    disconnect(){
        this.outputNode.disconnect();
    }

    get time(){
        return this._time;
    }

    set time(value){
        value = toRange(value, this.dParams.time.min, this.dParams.time.max)
        this._time = value;
        this.delayNode.delayTime.setTargetAtTime(value, this.context.currentTime, 0.01);
    }

    get feedback(){
        return this._feedback;
    }

    set feedback(value){
        value = toRange(value, this.dParams.feedback.min, this.dParams.feedback.max)
        this._feedback = value;

        this.feedbackGainNode.gain.setTargetAtTime(value / 100, this.context.currentTime, 0.01);
       

    }

    get name(){
        return "delay"
    }
}