import store from "./../../../../store";
import WaveSurfer from "wavesurfer";
import { hexToRgb } from "./../../../../utils/colors/converter";
import { getBeatLength } from "./../../../../utils/bpm/converter";

export default class Looper {
    makeLoop(channel, loopLength){
        channel.loop = {}// namespace for loop variables;
        const state = store.getState();
        const channelName = channel.channelName;

        const beatLength = getBeatLength(state.console.channel[channelName].track.bpm);
        const beatOffset = state.console.channel[channelName].playBackState.offset;
        const currentPosition = channel.master.getCurrentTime();
        const audioBufferSource = channel.master.backend.source;
        channel.loop.audioBufferSource = audioBufferSource;
        channel.loop.beatLength = beatLength;

        channel.loop.start = currentPosition 
            + (beatLength - (currentPosition - beatOffset) % beatLength);
        //don't quantize to whole beat
        console.log(loopLength)
        if(loopLength < 1){ 
            channel.loop.start = currentPosition 
                + ((beatLength * loopLength) - (currentPosition - beatOffset) % (beatLength * loopLength));
        }
        channel.loop.end = channel.loop.start + beatLength * loopLength;

        audioBufferSource.loopStart = channel.loop.start;
        audioBufferSource.loopEnd = channel.loop.end;
        audioBufferSource.loop = true;

        //looping waveSurrfer and update end position if is set; 
        channel.loop.watch = (time)=>{
            if(time > channel.loop.end){
                channel.master.backend.startPosition = channel.loop.start;
                channel.master.backend.lastPlay = channel.master.backend.ac.currentTime;
                channel.master.drawer.progress(channel.master.backend.getPlayedPercents());
                if(channel.loop.nextEnd){
                    this._updateLoopEnd(channel, channel.loop.nextEnd);
                    delete channel.loop.nextEnd;
                }
            }
        }

        channel.master.on("audioprocess", channel.loop.watch);
        this.drawLoop(channel);
    }

    updateLoop(channel, loopLength){
        const { start, beatLength } = channel.loop;
        const newEnd = start + beatLength * loopLength;
        const currentPosition = channel.master.getCurrentTime();
        if(newEnd < currentPosition ){
            channel.loop.nextEnd = newEnd;
        } else {
            this._updateLoopEnd(channel, newEnd)
        }
    }

    _updateLoopEnd(channel, newEnd){
        channel.loop.end = newEnd;
        channel.loop.audioBufferSource.loopEnd = newEnd;
        this.clearDraw(channel);
        this.drawLoop(channel);
    }

    endLoop(channel){
        console.log("stop loop", channel);
        channel.master.un("audioprocess", channel.loop.watch);
        channel.master.backend.source.loop = false;
        this.clearDraw(channel);
        delete channel.loop;
    }

    drawLoop(channel){
        let {start, end} = channel.loop;
        const wrapper = channel.master.drawer.wrapper;
        const styleApply = WaveSurfer.Drawer.style;
        const minPxPerSec = channel.master.params.minPxPerSec;
        const color = hexToRgb(channel.master.params.waveColor);

        const regionStyle = {
            position: "absolute",
            top: "0px",
            height: "100%",
            background: "rgba(" + color.r + "," + color.g + "," + color.b + ", 0.3)"
        };

        const region = document.createElement("div");
        regionStyle.left =   start * minPxPerSec  + "px";
        regionStyle.width = (end - start) * minPxPerSec  + "px";

        styleApply(region, regionStyle);
        wrapper.appendChild(region);
        channel.loop.region = region;
    }

    clearDraw(channel){
        channel.loop.region.remove();
    }
}
