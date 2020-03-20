export default class Effect {
    connect(audioNode){
        throw Error("unimplemented function connect in"  + this.constructor.name)
    }

    disconnect(){
        throw Error("unimplemented function disconnect in"  + this.constructor.name)
    }
}

