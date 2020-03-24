export default class Effect {
    connect(inputNode, outputNode){
        throw Error("unimplemented function connect in"  + this.constructor.name)
    }

    disconnect(){
        throw Error("unimplemented function disconnect in"  + this.constructor.name)
    }

    get name(){
        throw Error(this.constructor.name + " don't display effect name")
    }
}

