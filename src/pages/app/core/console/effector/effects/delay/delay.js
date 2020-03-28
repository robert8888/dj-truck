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
        this._default = Delay.defaultParams().params;
        this._context = context;

        this._buildNodes();
        this._initParams(params)

    }

    _buildNodes(){
        this.inputNode = this._context.createGain();
        this.outputNode = this._context.createGain();
        this.feedbackGainNode = this._context.createGain();
        this.delayNode = this._context.createDelay();

        // line in to wet mix
        this.inputNode.connect(this.delayNode);

        // feedback loop
        this.delayNode.connect(this.feedbackGainNode);
        this.feedbackGainNode.connect(this.delayNode);

        // wet out
        this.delayNode.connect(this.outputNode);
    }

    
    get name(){
        return "Delay"
    }

    get time(){
        return this._time;
    }

    set time(value){
        value = this._valueToRange(value, "time")
        this._time = value;
        this.delayNode.delayTime.setTargetAtTime(
                value, 
                this._context.currentTime,
                0.01
            );
    }

    get feedback(){
        return this._feedback;
    }

    set feedback(value){
        value = this._valueToRange(value, "feedback")
        this._feedback = value;
        this.feedbackGainNode.gain.setTargetAtTime(
                value / 100,
                this._context.currentTime, 
                0.01
            )
    }
}