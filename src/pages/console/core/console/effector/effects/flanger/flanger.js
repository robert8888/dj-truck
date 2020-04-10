import Effect from "../effect";

export default class Flanger extends Effect {

    static defaultParams() {
        return {
            params: {
                time: { // div by  100
                    min: 0,
                    max: 100,
                    defaultValue: 45,
                    type: "float",
                    description: "time"
                },
                speed: { // div by 10
                    min: 5,
                    max: 50,
                    defaultValue: 14,
                    type: "float",
                    description: "speed"
                },
                depth: {// div by 20 000
                    min: 10,
                    max: 100,
                    defaultValue: 19,
                    type: "float",
                    description : "depth"
                },
                feedback : { // div by 100
                    min: 0,
                    max: 80,
                    defaultValue: 8,
                    type: "float",
                    description : "fb"
                }
            }
        }
    }


    constructor(context, params){
        super();
        this._context = context;
        this._default = Flanger.defaultParams().params;

        this._buildNodes();
        this._initParams(params, Flanger.defaultParams().params);
    }

    _buildNodes(){
        this.inputNode = this._context.createGain();
        this.outputNode = this._context.createGain();
        this.inputFeedbackNode = this._context.createGain();
        this.wetGainNode = this._context.createGain();
        this.delayNode = this._context.createDelay();
        this.oscillatorNode = this._context.createOscillator();
        this.gainNode = this._context.createGain();
        this.feedbackNode = this._context.createGain();
        this.oscillatorNode.type = 'sine';
    
        this.inputNode.connect(this.inputFeedbackNode);

    
        this.inputFeedbackNode.connect(this.delayNode);
        this.inputFeedbackNode.connect(this.wetGainNode);
    
        this.delayNode.connect(this.wetGainNode);
        this.delayNode.connect(this.feedbackNode);
    
        this.feedbackNode.connect(this.inputFeedbackNode);
        this.oscillatorNode.connect(this.gainNode);
        this.gainNode.connect(this.delayNode.delayTime);
    

        this.wetGainNode.connect(this.outputNode);

	    this.oscillatorNode.start(0);
        this.wetGainNode.gain.value = 0.7;
    }


    get name(){
        return "Flanger"
    }

    get time(){
        return this._time;
    }

    set time(value){
        value = this._valueToRange(value, "time")
        this._time = value;
        this.delayNode.delayTime.setTargetAtTime( 
                value / 100, 
                this._context.currentTime, 
                0.01
            );
    }

    get speed(){
        return this._speed;
    }

    set speed(value){
        value = this._valueToRange(value, "speed");
        this._speed= value;
        this.oscillatorNode.frequency.value = value / 10;
    }

    get depth(){
        return this._depth;
    }

    set depth(value){
        value = this._valueToRange(value, "depth");
        this._depth = value;
        this.gainNode.gain.setTargetAtTime(
                value / 20000, 
                this._context.currentTime, 
                0.01
            );
    }

    get feedback(){
        return this._feedback;
    }

    set feedback(value){
        value = this._valueToRange(value, "feedback");
        this._feedback = value;
        this.feedbackNode.gain.setTargetAtTime(
                value/ 100, 
                this._context.currentTime, 
                0.01
            )
    }
}
