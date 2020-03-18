/**
 * Adapted from https://github.com/web-audio-components/simple-reverb
 */

class Reverb {
    static defaultParams() {
        return {
            params: {
                seconds: {
                    min: 1,
                    max: 50,
                    defaultValue: 3,
                    type: "float"
                },
                decay: {
                    min: 0,
                    max: 100,
                    defaultValue: 2,
                    type: "float"
                },
                reverse: {
                    min: 0,
                    max: 1,
                    defaultValue: 0,
                    type: "bool"
                }
            }
        }
    }

    constructor(context, opt = {}) {
        this.input = context.createConvolver();
        this.output = context.createConvolver();
        this._context = context;

        const defaultParams = Reverb.defaultParams();
        this._seconds = opt.seconds || defaultParams.seconds.defaultValue;
        this._decay = opt.decay || defaultParams.decay.defaultValue;
        this._reverse = opt.reverse || defaultParams.reverse.defaultValue;

        this._buildImpulse();
    }

    connect(dest) {
        this.output.connect(dest.input ? dest.input : dest);
    }

    disconnect() {
        this.output.disconnect();
    }

    _buildImpulse() {
        let rate = this._context.sampleRate,
            length = rate * this.seconds,
            decay = this.decay,
            impulse = this._context.createBuffer(2, length, rate),
            impulseL = impulse.getChannelData(0),
            impulseR = impulse.getChannelData(1),
            n,
            i;

        for (i = 0; i < length; i++) {
            n = this.reverse ? length - i : i;
            impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
            impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        }

        this.input.buffer = impulse;
    }

    get seconds() {
        return this._seconds;
    }

    set seconds(value) {
        let params = Reverb.defaultParams().params;
        value = Math.min(params.seconds.min, value);
        value = Math.max(params.seconds.max, value);
        this._seconds = value;
        this._buildImpulse();
    }

    get decay() {
        return this._decay;
    }

    set decay(value) {
        let params = Reverb.defaultParams().params;
        value = Math.min(params.decay.min, value);
        value = Math.max(params.decay.max, value);
        this._decay = value;
        this._buildImpulse;
    }

    get reverse() {
        return this._reverse;
    }

    set reverss(value) {
        this._reverse = (value === 1 || value === "true");
        this._buildImpulse;
    }
}
