import store from "./../../../../../../store";
import { recording, recordingRquestFail, recordFinalUpdate, roolbackRecord } from "./../../../../../../actions"
import STATUS from "./../../observer/STATUS";
import io from "socket.io-client";
import { getApi } from "./../../../../../../apis/apiProvider";
import WebWorker from "./../../../../../../utils/worker/workerSetup";
import interpolatePeakWorker from "./interpolatePeaksWorker";


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
        
        this._interpolatePeaksWorker = new WebWorker(interpolatePeakWorker);
        this._interpolatePeaksWorker.addEventListener('message', this._onPeakReady.bind(this));
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
        //console.log("im start recording", recId, recName);
        const token = store.getState().user.token;
        if (!token) {
            return;
        }

        const socket = io.connect(this.wsUrl);

        socket.on("connect", () => {
            //console.log("we have connection")
            socket.emit('authentication', { token: token });
            socket.on('authenticated', () => {
                // console.log('auth')
                socket.emit("record_details", { recId, recName })
            })
            socket.on('recorder_ready', () => {
                this.currentRec.id = recId;
                this.currentRec.title = recName;

                this.mediaRecorder.ondataavailable = (e) => {
                    // console.log(e.data)
                    socket.emit('record_chunk', e.data)
                }

                this.mediaRecorder.addEventListener('stop', () => {
                    // socket.close()
                    socket.emit('record_stop')
                })

                this.mediaRecorder.start(1000);

                this.currentRec.duration = new Date().getTime();

                this.updateInterval = setInterval(this._updatePeaks.bind(this), 100);

                store.dispatch(recording());
            });

            socket.on('connect_error', () => {
                store.dispatch(recordingRquestFail())
            })

            socket.on('recording_finished', ({ fileSize }) => {
              //  console.log("recording finishe event from socekt")

                this.currentRec.fileSize = fileSize;
               // console.log("post peeaks to worker ", this.currentRec.peaks)
                this._interpolatePeaksWorker.postMessage([this.currentRec.peaks]);

                socket.close();
            })

            socket.on("recording_error", () => {
                store.dispatch(roolbackRecord(this.currentRec.id))
            })
        })
    }

    endRecording() {
        //  console.log("im finish recoriding")
        if (this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            clearInterval(this.updateInterval);
            this.currentRec.duration = new Date().getTime() - this.currentRec.duration;
        }
    }

    _updatePeaks() {
        try {
            const len = this.currentRec.peaks.length;
            this.currentRec.peaks[len] = this.mixer.currentPeakMinMax[0];
            this.currentRec.peaks[len + 1] = this.mixer.currentPeakMinMax[1];
        } catch{
            console.log("Error can't update record waveform")
        }
    }

    _onPeakReady(workerEvent){
        if(!workerEvent.data || !(workerEvent.data[0] instanceof Array)){
            throw new Error('Transforming peaks failed')
        }
        const peaks = workerEvent.data[0];
        const { id, duration, fileSize } = this.currentRec;
        this.updateRecord({
            id, duration, fileSize, peaks
        })
    }

    updateRecord(data){
        console.log('i got peaks')
        const {id, peaks, duration, fileSize} = data;
        store.dispatch(recordFinalUpdate(
            id, peaks, duration, fileSize
        ))
        this.currentRec = Recorder.initRecState();

    }

}