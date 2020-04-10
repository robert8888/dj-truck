import {toRange} from "./../../../../../../utils/math/argRanges";


export default class Effect {

    _initParams(params){
        for(let [name, value] of Object.entries(this._default)){
            this[name] = params[name] || value.defaultValue;
        }
    }

    _valueToRange(value, name){
        let param = this._default[name];
        return toRange(value, param.min, param.max);
    }

    connect(input, dest){
        input.connect(this.inputNode);
        this.outputNode.connect(dest);
    }

    disconnect(){
        this.outputNode.disconnect();
    }

    get name(){
        throw Error(this.constructor.name + " don't display effect name")
    }
}

