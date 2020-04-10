import Effect from "./../effect";

export default class Distortion extends Effect {

    static defaultParams(){
        return {
            params : {
                gain: {
                    min: 0,
                    max: 100,
                    defaultValue: 10,
                    type: "float",
                    description : "gain"
                }
            }
        }
    }

    constructor(context, params){
        super();
        this._context = context;
        this._default = Distortion.defaultParams().params;

        this._buildNodes(context);
        this._initParams(params);
    }

    _buildNodes(){
        this.waveShaperNode = this._context.createWaveShaper();
        this.inputNode = this.outputNode = this.waveShaperNode;
    }

    get name(){
        return "Distortion"
    }

    get gain(){
        return this._gain;
    }

    set gain(value){
        value = this._valueToRange(value, "gain");
        this._gain = value;
        this._adjustGain();
    }

    _adjustGain() {
        let gain = this.gain;
        let n_samples = 44100;
        let curve = new Float32Array(n_samples);
        let deg = Math.PI / 180;
        let x;

        for (let i = 0; i < n_samples; ++i ) {
            x = i * 2 / n_samples - 1;
            curve[i] = (3 + gain) * x * 20 * deg / (Math.PI + gain * Math.abs(x));
        }

        this.waveShaperNode.curve = curve;
    }
	
}

