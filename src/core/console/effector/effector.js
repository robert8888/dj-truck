
import store from "./../../../store";


export default class Effector {
    constructor(audioContext) {
        this.config = store.getState().configuration.effector;
        this.mainAC = audioContext;

    }

    connect(inputs) {
        const outputs = inputs.map(() => this.mainAC.createGain())

        inputs.forEach((inputNode, index) => {
            inputNode.connect(outputs[index])
        });

        return outputs;
    }
}