/**
 * Adapted from https://github.com/web-audio-components/simple-reverb
 */
import Effect from "./../effect";
import worker from "./buildImpulseWebWorker";
import WebWorker from "./workerSetup";
import {toRange} from "./../../../../../../../utils/math/argRanges";

export default class Reverb extends Effect {
    static defaultParams() {
        return {
            params: {
                seconds: {
                    min: 1,
                    max: 50,
                    defaultValue: 3,
                    type: "float",
                    description: "time"
                },
                decay: {
                    min: 0,
                    max: 100,
                    defaultValue: 2,
                    type: "float",
                    description: "decay"
                },
                reverse: {
                    min: 0,
                    max: 1,
                    defaultValue: 0,
                    type: "bool",
                    description : "rev"
                }
            }
        }
    }

    constructor(context, opt = {}) {
        super();
        this.input = this.output = context.createConvolver()
        this._context = context;

        const defaultParams = Reverb.defaultParams().params;
        this._seconds = opt.seconds || defaultParams.seconds.defaultValue;
        this._decay = opt.decay || defaultParams.decay.defaultValue;
        this._reverse = opt.reverse || defaultParams.reverse.defaultValue;

        this.configWorker();
        this._buildImpulse();
    }

    configWorker(){
        this._buildImpulseWorker = new WebWorker(worker);
        this._buildImpulseWorker.addEventListener("message", e =>{
            if(e.data[0].type === "IMPLUSE"){
                const impulseL = e.data[1];
                const impulseR = e.data[2];
                const length = e.data[0].length;
         
                const impulse = this._context.createBuffer(2, length, this._context.sampleRate);
                impulse.copyToChannel(impulseL, 0, 0);
                impulse.copyToChannel(impulseR, 1, 0);
                this.input.buffer = impulse;
            }
        })
    }

    connect(input, dest) {
        //input.connect(dest)
        
        input.connect(this.input);
        this.output.connect(dest);
        if(!this._buildImpulseWorker){
            this.configWorker();
        }
    }

    disconnect() {
        this.output.disconnect();
        this._buildImpulseWorker.terminate();
        delete this._buildImpulseWorker;
    }

    _buildImpulse(){
        let rate = this._context.sampleRate;
        const length = rate * this.seconds;

        console.log("this seconds" , this.seconds)

        const impulse = this._context.createBuffer(2, length, rate);
        const impulseR = new Float32Array(length);
        const impulseL = new Float32Array(length);
        impulse.copyFromChannel(impulseL, 0, 0);
        impulse.copyFromChannel(impulseR, 1, 0);

        this._buildImpulseWorker.postMessage([{
            type: "BUILD_IMPULSE",
            length : length,
            decay : this._decay,
            reverse : this._reverse
        }, impulseL, impulseR])
    }

    

    get seconds() {
        return this._seconds;
    }

    set seconds(value) {
        let params = Reverb.defaultParams().params.seconds;
        value = toRange(value, params.min, params.max)
        this._seconds = value;
        this._buildImpulse();
    }

    get decay() {
        return this._decay;
    }

    set decay(value) {
        let params = Reverb.defaultParams().params.decay;
        value = toRange(value, params.min, params.max)
        this._decay = value;
        this._buildImpulse();
    }

    get reverse() {
        return this._reverse;
    };

    set reverse(value) {
        this._reverse = (value === 1 || value === "true");
        this._buildImpulse();
    }

    get name(){
        return "reverb";
    }
}
