import store from "./../../../../../store";
import { recording, recordingRquestFail, recordFinalUpdate, roolbackRecord } from "../../../../../actions"
import STATUS from "./../observer/STATUS";
import io from "socket.io-client";
import { getApi } from "../../../../../apis/apiProvider";
import { Logger, Log } from "../../../../../utils/logger/logger";


export default class Recorder {
    static initRecState = () => ({
        id: null,
        title: "",
        peaks: [],
        duration: 0,
    })

    constructor(mixer) {
        this.mixer = mixer;

        const streamDestination = this.mixer.audioNodes.channels['main'].recorderStremDestination;
        this.mediaRecorder = new MediaRecorder(streamDestination.stream, {
            mimeType: 'audio/webm;codecs=opus',
        });

        const api = getApi("RecordsStore");
        this.wsUrl = api.getSocketUrl();

        this.currentRec = Recorder.initRecState();


        this.peaksUpdateIntervalHandle = null;
        this.peaksUpdateIntervalTime = 100; //ms
        this.peaksSizeLimit = 2000;
    }


    action(status, param) {
        switch (status) {
            case STATUS.RECORD_START: {
                this.startRecording(param);
                break;
            }
            case STATUS.RECORD_END: {
                this.endRecording()
                break;
            }
            default: return;
        }
    }

    startRecording({ recId, recName }) {
    try {
        const token = store.getState().user.token;
        if (!token) {
            Logger.push(Log.Error(
                {
                    private: "Attempt to start recordin not' authorized user",
                    path: ['pages', 'console', 'core', 'mixxer', 'recorder', 'startRecording']
                }))
            return;
        }
        if (this.mediaRecorder.state === "recording") {
            Logger.push(Log.Error(
                {
                    private: "Attempt to start recordin during active recording",
                    path: ['pages', 'console', 'core', 'mixxer', 'recorder', 'startRecording']
                }))
            return;
        }

        const socket = io.connect(this.wsUrl);

        socket.on("connect", () => {
            socket.emit('authentication', { token: token });
            socket.on('authenticated', () => {
                socket.emit("record_details", { recId, recName })
            })
            socket.on('recorder_ready', () => {
                this.currentRec.id = recId;
                this.currentRec.title = recName;

                this.mediaRecorder.ondataavailable = (e) => {
                    socket.emit('record_chunk', e.data)
                }

                this.mediaRecorder.addEventListener('stop', () => {
                    socket.emit('record_stop')
                })

                this.mediaRecorder.start(1000);

                this.currentRec.duration = new Date().getTime();

                this.peaksUpdateIntervalHandle = setInterval(this.updatePeaks.bind(this), 100);

                store.dispatch(recording());
            });

            socket.on('connect_error', () => {
                store.dispatch(recordingRquestFail())
                Logger.push(Log.Error(
                    {
                        private: "Error durring connectio to recorder api",
                        public: "During porccess of connection to record database occured problem",
                        path: ['pages', 'console', 'core', 'mixxer', 'recorder', 'record socket connecting record'],
                    }))
            })

            socket.on('recording_finished', ({ fileSize }) => {
                this.currentRec.fileSize = fileSize;
                const { id, duration, peaks } = this.currentRec;
                this.updateRecord({
                    id, duration, fileSize, peaks
                })
                socket.close();
            })

            socket.on("recording_error", () => {
                store.dispatch(roolbackRecord(this.currentRec.id))
                Logger.push(Log.Error(
                    {
                        private: "Rocording socket error. ",
                        public: "During porccess of recording occured problem",
                        path: ['pages', 'console', 'core', 'mixxer', 'recorder', 'record socket error'],
                    }))
            })
        })
        } catch(error){
            Logger.push(Log.Error(
                {
                    private: "Rocording error " + error.message,
                    public: "During porccess of recording occured problem",
                    path: ['pages', 'console', 'core', 'mixxer', 'recorder', 'startRecording'],
                    error,
                }))
        }
    }

    endRecording() {
        if(this.mediaRecorder.state === "inactive"){
            return;
        }

        clearInterval(this.peaksUpdateIntervalHandle);
        this.mediaRecorder.stop();
        this.currentRec.duration = new Date().getTime() - this.currentRec.duration;
    }

    updatePeaks() {
        try {
            const len = this.currentRec.peaks.length;
            this.currentRec.peaks[len] = this.mixer.peekMeterData.main.post.minMax[0];
            this.currentRec.peaks[len + 1] = this.mixer.peekMeterData.main.post.minMax[1];
            if (this.currentRec.peaks.length > this.peaksSizeLimit) {
                this.currentRec.peaks = this.reducePeaks(this.currentRec.peaks)
                clearInterval(this.peaksUpdateIntervalHandle);
                this.peaksUpdateIntervalTime *= 2;
                this.peaksUpdateIntervalHandle = setInterval(this.updatePeaks.bind(this), this.peaksUpdateIntervalTime);
            }
        } catch(error){
            Logger.push(Log.Error(
                {
                    private: "Error during updating record peaks, Can't udpate record waveform",
                    public: "During porccess of recording occured problem",
                    path: ['pages', 'console', 'core', 'mixxer', 'recorder', 'updatePeaks'],
                    error
                }))
        }
    }

    updateRecord(data) {
        const { id, peaks, duration, fileSize } = data;
        store.dispatch(recordFinalUpdate(
            id, peaks, duration, fileSize
        ))
        this.currentRec = Recorder.initRecState();
    }

    reducePeaks(input, ratio = 2) {
        let output = [];
        const inputSize = input.length;
        const outputSize = Math.ceil(inputSize / ratio);

        for (let i = 0; i < outputSize / 2; i++) {
            output[2 * i] = input[2 * (i * ratio)];
            output[2 * i + 1] = input[(2 * (i * ratio)) + 1];
        }

        return output;
    }

}