import Effect from "./../effect";

export default class DubDelay extends Effect{

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
                cutOff: {
                    min: 0,
                    max: 4000,
                    defaultValue: 700,
                    type: "float",
                    description: "cut"
                },
            }
        }
    }

    constructor(context, params){
        super();
        this._context = context;
        this._default = DubDelay.defaultParams().params;

        this._buildNodes(context);
        this._initParams(params);
    }

    _buildNodes(){

        this.inputNode = this._context.createGain();
        this.outputNode = this._context.createGain();
        this.dryGainNode = this._context.createGain();
        this.wetGainNode = this._context.createGain();
        this.feedbackGainNode = this._context.createGain();
        this.delayNode = this._context.createDelay();
        this.bqFilterNode = this._context.createBiquadFilter(); 
    
        //connect
        this.inputNode.connect(this.wetGainNode);
        this.inputNode.connect(this.feedbackGainNode);
    
        this.feedbackGainNode.connect(this.bqFilterNode);
        this.bqFilterNode.connect(this.delayNode);
        this.delayNode.connect(this.feedbackGainNode);
        this.delayNode.connect(this.wetGainNode);
    
        this.wetGainNode.connect(this.outputNode);
        
    }



    get name(){
        return "Dub Delay"
    }

    get time(){
        return this._time;
    }

    set time(value){
        value = this._valueToRange(value, "time");
        this._time = value;
        this.delayNode.delayTime.setTargetAtTime(
                value, 
                this._context.currentTime,
                0.01
            )
    }

    get feedback(){
        return this._feedback;
    }

    set feedback(value){
        value = this._valueToRange(value, "feedback");
        this._feedback = value;
        this.feedbackGainNode.gain.setTargetAtTime(
                value / 100, 
                this._context.currentTime, 
                0.01
            )
    }

    get cutOff(){
        return this._cutOff;
    }

    set cutOff(value){
        value = this._valueToRange(value, "cutOff")
        this._cutOff = value;
        this.bqFilterNode.frequency.setTargetAtTime(
                value, 
                this._context.currentTime, 
                0.01
            );
    }
}


