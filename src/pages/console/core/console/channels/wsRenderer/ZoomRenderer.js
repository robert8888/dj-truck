import Drawer from "wavesurfer.js/src/drawer";
import Max from "wavesurfer.js/src/util/max";
import Min from "wavesurfer.js/src/util/min";

const evenFloor = value => (~~( value / 2)) * 2;

export default class ZoomRenderer extends Drawer{
    constructor(...args) {
        super(...args);

    }

    init() {
        this.regions = [];
        this.createWrapper();
        this.createElements();
    }


    handleEvent(e, noPrevent) {
        !noPrevent && e.preventDefault();

        let clientX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
        let bbox = this.waveCc.canvas.getBoundingClientRect();

        if(!this.peaks || !this.peaks.length) return 0;


        const x = (clientX - bbox.left) * this.params.pixelRatio;
        const ratio = bbox.width / this.waveCc.canvas.width
        const shiftAboutSeconds  = (x - ((this.cursorShift || this.cursor) * ratio)) / (this.minPxPerSec * ratio);

        this.cursorShift = x / ratio;
        this.justClicked = true;

        let progress = this.currentProgress + (shiftAboutSeconds / this.duration);
        return Math.min(1, Math.max(0, progress))
    }

    createElements() {
        let waveCanvas = this.wrapper.appendChild(
            this.style(document.createElement('canvas'), {
                position: 'absolute',
                zIndex: 1,
                left: 0,
                top: 0,
                height: "100%",
                width: "100%",
            })
        );
        this.waveCc = waveCanvas.getContext('2d');
    }

    updateSize() {
        this._break = true;
        this.wrapper.scrollLeft = 0;
    }

    clearWave() {
        if(!this.waveCc) return;
        this.cursorShift = undefined;
        this.bpm = undefined;
        this.beatOffset = undefined;
        this.waveCc.clearRect(0, 0, this.waveCc.canvas.width, this.waveCc.canvas.height);
    }


    isWaveEqual(){
        if((!this.peaks || !this.peaks.length) ||
            this.lastProgress === this.currentProgress &&
            this.lastPeakLength === this.peaks.length &&
            this.lastBpm === this.bpm &&
            this.lastBeatOffset === this.beatOffset) {
            return true;
        }

        this.lastProgress = this.currentProgress;
        this.lastPeakLength = this.peaks.length;
        this.lastBeatOffset = this.beatOffset;
        this.lastBpm = this.bpm;
        return false;
    }


    runRender(){
        if(this._runingRenderLoop) return;

        this.render();
        this._runingRenderLoop = true;
    }

    stopRender(){
        this._runingRenderLoop = false;
    }

    render(){
        this._runingRenderLoop && requestAnimationFrame(() => this.render())

        if(this.isWaveEqual()) return;

        const minPxPerSec = this.minPxPerSec;
        const peaks = this.peaks;
        const width =  this.waveCc.canvas.width;

        let cursor = Math.min(evenFloor((this.peaks.length / 2) * (this.currentProgress)), width / 2) ;
        this.cursor = cursor;
        cursor = ~~(this.cursorShift || cursor);


        const correction =  (((width / 2 ) - cursor) / minPxPerSec ) / this.duration ;

        let start = evenFloor(Math.max(this.peaks.length / 2 * (this.currentProgress + correction)  - (width / 2) , 0));
        let end = start + (width * 2);

        let channelIndex = this.channelIndex;

        // A half-pixel offset makes lines crisp
        let $ = 0.5 / this.params.pixelRatio;
        let height = this.params.height * this.params.pixelRatio;
        let offsetY = height * channelIndex || 0;
        let halfH = height / 2;
        let length = ~~(end - start);


        let cc = this.waveCc;
        if (!cc) { return; }

        this.waveCc.clearRect(0, 0, this.waveCc.canvas.width, this.waveCc.canvas.height);

        const progress = evenFloor(cursor / width * length / 2 + start);

        // Always draw a median line
        this.waveCc.fillStyle = this.params.progressColor;
        cc.fillRect(0, halfH + offsetY - $, this.width, $);


        const renderWave = (fill, from, to, shift = 0, scale = 1) => {
            this.waveCc.fillStyle = fill;

            cc.beginPath();
            cc.moveTo(shift * scale + $, halfH + offsetY);

            for (let i = from; i < to; i++) {
                let h = Math.round(peaks[2 * i] / this.absmax * halfH);
                cc.lineTo((i - start) * scale + $, halfH - h + offsetY);
            }

            for (let i = to - 1; i >= from; i--) {
                let h = Math.round(peaks[2 * i + 1] / this.absmax * halfH);
                cc.lineTo((i - start) * scale + $, halfH - h + offsetY);
            }

            cc.closePath();
            cc.fill();
        }

        const renderBeatBars = () =>{
            this.waveCc.fillStyle = this.params.beatBarColor;

            const progressPosition = start /  peaks.length  * 2;
            const barGap = 60 / this.bpm * minPxPerSec;
            const barOffset = (this.beatOffset - (this.duration * progressPosition)) * minPxPerSec % barGap;

            for(let pos = barOffset; pos < width; pos += barGap){
                cc.fillRect(pos, 0,  this.params.beatBarWidth, this.waveCc.canvas.height);
            }
        }

        const renderCursor = () =>{
            if(cursor){
                this.waveCc.fillStyle = this.params.cursorColor;
                cc.fillRect(cursor, 0, this.params.cursorWidth, this.waveCc.canvas.height);
            }
        }

        const renderRegion = (region) =>{
            this.waveCc.fillStyle = this.params.regionColor;
            const {start: from, end: to} = region;
            const startTime = (start / minPxPerSec );
            const fromPos = Math.max((from - startTime) * minPxPerSec - 1, 0);
            const toPos = Math.min((to - startTime) * minPxPerSec - 1, width);
            cc.fillRect(fromPos, 0, toPos - fromPos, this.waveCc.canvas.height);
        }

        renderWave(this.params.progressColor, start, progress, 0);
        renderWave(this.params.waveColor, progress, end, cursor)

        renderCursor();
        renderBeatBars();

        this.regions.forEach(region => renderRegion(region));

        this.centerCursor();
    }

    centerCursor(){
        const width = this.waveCc.canvas.width;

        if(this.justClicked){
            this.justClicked = false;
            return;
        }

        this.cursorShift += (this.cursorShift - width / 2 < 4) ?  2 : -2;

        if(this.cursorShift  && Math.abs(this.cursorShift - width / 2) < 5){
            this.cursorShift = width /2 ;
        }
    }


    prepareRender(){
        this.minPxPerSec = this.params.minPxPerSec;
        // Support arrays without negative
        let peaks = this.peaks;
        let hasMinValues = [].some.call(peaks, function (val) { return val < 0; });
        if (!hasMinValues) {
            let reflectedPeaks = [];
            for (let i = 0, len = peaks.length; i < len; i++) {
                reflectedPeaks[2 * i] = peaks[i];
                reflectedPeaks[2 * i + 1] = -peaks[i];
            }
            this.peaks = reflectedPeaks;
        }

        if (this.params.normalize) {
            let max = Max(peaks);
            let min =  Min(peaks);
            this.absmax = -min > max ? -min : max;
        } else {
            this.absmax = 1;
        }

        this.duration = peaks.length / this.params.minPxPerSec  / 2;
    }

    drawWave(peaks, channelIndex, start, end) {
        this.peaks = peaks;
        this.channelIndex = channelIndex;

        this.prepareRender();

        this.runRender();
    }

    progress(progress) {
        this.currentProgress = progress;
    }

    //remove default implementation
    recenterOnPosition(position, immediate) {}

    setGrid({bpm, offset}){
        this.bpm = bpm;
        this.beatOffset = offset;
    }

    setRegions(regions){
        if(regions instanceof Array){
            this.regions = regions;
        } else if(regions instanceof Object && "start" in regions && "end" in regions){
            this.regions = [regions];
        } else {
            this.regions = [];
        }
    }
}