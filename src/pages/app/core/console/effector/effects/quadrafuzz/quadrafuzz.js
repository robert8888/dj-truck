
import Effect from "../effect";

export default class Quadrafuzz extends Effect{

    static defaultParams(){
        return {
            params : {
                lowGain: {
                    min: 0,
                    max: 100,
                    defaultValue: 20,
                    type: "float",
                    description : "low"
                },
                midLowGain: {
                    min: 0,
                    max: 100,
                    defaultValue: 20,
                    type: "float",
                    description: "mlow"
                },
                midHighGain: {
                    min: 0,
                    max: 100,
                    defaultValue: 20,
                    type: "float",
                    description: "m-high"
                },
                highGain: {
                    min: 0,
                    max: 100,
                    defaultValue: 20,
                    type: "float",
                    description: "high"
                },
            }
        }
    }
    constructor(context, params){
        super();
        this._context = context;
        this._default = Quadrafuzz.defaultParams().params;

        this._buildNodes();
        this._initParams(params);
    }

    _buildNodes(){
        this.inputNode = this._context.createGain();
        this.outputNode = this._context.createGain();
        this.wetGainNode = this._context.createGain();


        this.lowpassLeft = this._context.createBiquadFilter();
        this.lowpassLeft.type = 'lowpass';
        this.lowpassLeft.frequency.value = 147;
        this.lowpassLeft.Q.value = 0.7071;

        this.bandpass1Left = this._context.createBiquadFilter();
        this.bandpass1Left.type = 'bandpass';
        this.bandpass1Left.frequency.value = 587;
        this.bandpass1Left.Q.value = 0.7071;

        this.bandpass2Left = this._context.createBiquadFilter();
        this.bandpass2Left.type = 'bandpass';
        this.bandpass2Left.frequency.value = 2490;
        this.bandpass2Left.Q.value = 0.7071;

        this.highpassLeft = this._context.createBiquadFilter();
        this.highpassLeft.type = 'highpass';
        this.highpassLeft.frequency.value = 4980;
        this.highpassLeft.Q.value = 0.7071;


        this.overdrives = [];
        for (var i = 0; i < 4; i++) {
            this.overdrives[i] = this._context.createWaveShaper();
            this.overdrives[i].curve = this.getDistortionCurve();
        }


        this.inputNode.connect(this.wetGainNode);


        var filters = [this.lowpassLeft, this.bandpass1Left, this.bandpass2Left, this.highpassLeft];
        for (i = 0; i < filters.length; i++) {
            this.wetGainNode.connect(filters[i]);
            filters[i].connect(this.overdrives[i]);
            this.overdrives[i].connect(this.outputNode);
        }
    }

    getDistortionCurve(gain) {
        var sampleRate = this._context.sampleRate;
        var curve = new Float32Array(sampleRate);
        var deg = Math.PI / 180;
    
        for (var i = 0; i < sampleRate; i++) {
            var x = i * 2 / sampleRate - 1;
            curve[i] = (3 + gain) * x * 20 * deg / (Math.PI + gain * Math.abs(x));
        }
        return curve;
    }

    get name(){
        return "Quadra"
    }

    get lowGain(){
        return this._lowGain;
    }
    
    set lowGain(value){
        value = this._valueToRange(value, "lowGain");
        this._lowGain = value;
        this.overdrives[0].curve = this.getDistortionCurve(this.lowGain, 0, 150);
    }

    get midLowGain(){
        return this._midLowGain;
    }

    set midLowGain(value){
        value = this._valueToRange(value, "midLowGain");
        this._midLowGain = value;
        this.overdrives[1].curve = this.getDistortionCurve(this.midLowGain, 0, 150);
    }

    get midHighGain(){
        return this._midHighGain;
    }

    set midHighGain(value){
        value = this._valueToRange(value, "midHighGain");
        this._midHighGain =value;
        this.overdrives[2].curve = this.getDistortionCurve(this.midHighGain, 0, 150);
    }

    get highGain(){
        return this._highGain;
    }

    set highGain(value){
        value = this._valueToRange(value, "highGain");
        this._highGain =value;
        this.overdrives[3].curve = this.getDistortionCurve(this.highGain, 0, 150)
    }
}
