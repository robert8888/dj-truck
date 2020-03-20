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
                    defaultValue: 0.3,
                    type: "float",
                    description: "time"
                },
            }
        }
    }

    constructor(context, params){
        super();
        this.params = Delay.defaultParams();
        this._time = params.time || this.params.time.defaultValue;
        this._feedback = params.feedback || this.params.feedback.defaultValue;
        this.context = context;

        this.inputNode = context.createGain();
        this.outputNode = context.createGain();
        this.feedbackGainNode = context.createGain();
        this.delayNode = context.createDelay();

        // line in to wet mix
        this.inputNode.connect(this.delayNode);

        // feedback loop
        this.delayNode.connect(this.feedbackGainNode);
        this.feedbackGainNode.connect(this.delayNode);

        // wet out
        this.delayNode.connect(this.outputNode);
    }

    connect(inputNode){
        inputNode.connect(this.inputNode);
        return this.outputNode;
    }

    disconnect(){
        this.outputNode.disconnect();
    }

    get time(){
        return this._time;
    }

    set time(value){
        value = toRange(value, this.params.time.min, this.params.time.max)
        this._time = value;
        this.delayNode.delaTime.setTargetAtTime(value, this.context.currentTime, 0.01);
    }

    get feedback(){
        return this._feedback;
    }

    set feedback(value){
        value = toRange(value, this.params.feedback.min, this.params.feedback.max)
        this._feedback = value;
        this.feedbackGainNode.gain.setTargetAtTime(value / 100, this.context.currentTime, 0.01)
    }
}