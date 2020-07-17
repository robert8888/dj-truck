export default function addPitchInKey(waveSurfer){

    console.log("ws", waveSurfer.backend.createSource)
    waveSurfer.backend.createSource = function () {
        console.log("creating source", this._pitchInKey)
        this.disconnectSource();
        this.source = this.ac.createBufferSource();

        //adjust for old browsers.
        this.source.start = this.source.start || this.source.noteGrainOn;
        this.source.stop = this.source.stop || this.source.noteOff;

        this.source.playbackRate.value = this.playbackRate;
        this.source.buffer = this.buffer;
        this.source.connect(this.analyser);
    }
}