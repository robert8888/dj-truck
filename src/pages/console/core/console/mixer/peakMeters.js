const peakMeters = {

    setUpSampleBuffers(channelName) {
        let fftSize = this.audioNodes.channels[channelName].analyserNode.fftSize;
        this.sampleBuffers.channels[channelName] = new Float32Array(fftSize);
    },

    getChannelPeakMeter(channelName) {
        let analyser = this.audioNodes?.channels[channelName]?.analyserNode
        if (!analyser) {
            return [];
        }
        let sampleBuffer = this.sampleBuffers.channels[channelName];
        if (!sampleBuffer) {
            return [];
        }
        return this.getPeakData(analyser, sampleBuffer)
    },

    getMasterPeakMetter(part){
        const main = this.audioNodes.channels['main'];
        let buffers = this.sampleBuffers.channels['main'];
        if(!buffers){
            buffers = this.sampleBuffers.channels["main"] = {};
        }
        if(part === "pre"){
            if(!buffers.pre){
                const fftSize = main.preAnalyserNode.fftSize;
                buffers.pre = new Float32Array(fftSize);
            }
            return this.getPeakData(main.preAnalyserNode, buffers.pre);
        } else if(part === "post"){
            if(!buffers.post){
                const fftSize = main.preAnalyserNode.fftSize;
                buffers.post = new Float32Array(fftSize);
            }
            const peak = this.getPeakDataComplex(main.postAnalyserNode, buffers.post);
            //store value to get possibility to consume it by recorder
            this.currentPeakMinMax = peak.minMax;
            return peak;
        }
    },

    
    
    getPeakData(analyser, sampleBuffer) {
        analyser.getFloatTimeDomainData(sampleBuffer);

        let peakPower = 0;
        for (let i = 0; i < sampleBuffer.length; i++) {
            const power = sampleBuffer[i] ** 2;
            // if statement is a litlebit faster that Math.max
            peakPower = (power > peakPower) ? power : peakPower;
        }
        const peakPowerDecibels = 10 * Math.log10(peakPower);

        return {
            peakdB: peakPowerDecibels,
        }
    },

    getPeakDataComplex(analyser, sampleBuffer){
        analyser.getFloatTimeDomainData(sampleBuffer);

        
        let minMax = [Infinity, -Infinity]; // [min, max]

        //average 
        // let sumOfSquares = 0;
        // for (let i = 0; i < sampleBuffer.length; i++) {
        //     sumOfSquares += sampleBuffer[i] ** 2;
        // }

        // const avgPowerDecibels = 10 * Math.log10(sumOfSquares / sampleBuffer.length);

        //peak 

        let peakPower = 0;
        for (let i = 0; i < sampleBuffer.length; i++) {
            minMax[0] = Math.min(minMax[0], sampleBuffer[i]);
            minMax[1] = Math.max(minMax[1], sampleBuffer[i]);
            //-----------------------------------------------
            const power = sampleBuffer[i] ** 2;
            // if statement is a litlebit faster that Math.max
            peakPower = (power > peakPower) ? power : peakPower;
        }
        const peakPowerDecibels = 10 * Math.log10(peakPower);

        return {
             //avgdB: avgPowerDecibels,
            peakdB: peakPowerDecibels,
            minMax: minMax,
        }
    }
}

export default peakMeters;