import Effect from "../effect";

export default class PingPongDelay extends Effect{

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
        this._context = context;
        this._default = PingPongDelay.defaultParams().params;

        this._buildNodes();
        this._initParams(params);
    }

    _buildNodes(){

        this.inputNode = this._context.createGain();
        this.outputNode = this._context.createGain();
        this.delayNodeLeft = this._context.createDelay();
        this.delayNodeRight = this._context.createDelay();
        this.dryGainNode = this._context.createGain();
        this.wetGainNode = this._context.createGain();
        this.feedbackGainNode = this._context.createGain();
        this.channelMerger = this._context.createChannelMerger(2);

    
        // the feedback loop
        this.delayNodeLeft.connect(this.channelMerger, 0, 0);
        this.delayNodeRight.connect(this.channelMerger, 0, 1);
        this.delayNodeLeft.connect(this.delayNodeRight);
        this.feedbackGainNode.connect(this.delayNodeLeft);
        this.delayNodeRight.connect(this.feedbackGainNode);
    
        //  mix
        this.inputNode.connect(this.feedbackGainNode);
    
        //  out
        this.channelMerger.connect(this.outputNode);
        this.outputNode.gain.value = 2;
    }

    get name(){
        return "Ping Pong Delay"
    }

    get time(){
        return this._time;
    }

    set time(value){
        value = this._valueToRange(value, "time")
        this._time= value;
        ///
        this.delayNodeLeft.delayTime.setTargetAtTime(
                value, 
                this._context.currentTime, 
                0.01
            )
        this.delayNodeRight.delayTime.setTargetAtTime(
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
                (value / 100),
                this._context.currentTime,
                0.01 
            )
    }
}
