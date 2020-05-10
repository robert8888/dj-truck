import { equalPowerFader } from "./../../../../../utils/sound/converter"

const fader  = {
    setFader(value) {//in procent from -50%  to + 50% (not 0.01) but 1
        let faderVolumeNodeA = this.audioNodes.channels["A"].faderVolumeNode;
        let faderVolumeNodeB = this.audioNodes.channels["B"].faderVolumeNode;
        let audioCtxA = this.channels.getChannel("A").backend.ac;
        let audioCtxB = this.channels.getChannel("B").backend.ac;

        if (!faderVolumeNodeA || !faderVolumeNodeB || !audioCtxA || !audioCtxB) {
            throw new Error(`Fader value not set. Mising auiodContext or AudioNode ref
                            .Checkout funtion setFader in mixer object`);
        }

        const { a: volA, b: volB } = equalPowerFader(value)

        faderVolumeNodeA.gain.setTargetAtTime(volA, audioCtxA.currentTime, 0.01);
        faderVolumeNodeB.gain.setTargetAtTime(volB, audioCtxB.currentTime, 0.01);
    }
}

export default fader;