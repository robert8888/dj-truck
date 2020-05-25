import { useMemo, useState, useEffect, useCallback } from "react"
import { getApi } from "./../../../apis/apiProvider";
import { PLAYBACK_STATE } from "./usePlabackState";

//getRecordUrl
class Player {
    constructor(){
        if(!Player.instance){
            Player.instance = this;
        } 
            
        return Player.instance;
    }
    

    progressUpdaterHandler = null;

    current = {
        id: null,
        start: 0,
        duration: 0,
        progress: 0,
        state: null,
        buffered: 0,
    };

    btnStateHandlers = {}
    progressSubscribers = {}
    bufferedSubscribers = []
    progressProviders = {};
    currentSubscribers = [];

    setCurrent(nextCurrent) {
        this.current = nextCurrent;
        this.spreadCurrentChange();
    }

    subscribeCurrent(handler) {
        this.currentSubscribers.push(handler)
        handler(this.current)
    }

    unSubscribeCurrent(handler) {
        this.currentSubscribers = this.currentSubscribers.filter(fun => !fun === handler);
    }

    spreadCurrentChange() {
        for (let handler of this.currentSubscribers) {
           handler(this.current);
        }
    }

    getCurrent(){
        return this.current;
    }

    addBtnCtrlHandler(id, handler) {
        this.btnStateHandlers[id] = handler;
    }

    removeBtnCtrlHandler(id){
        delete this.btnStateHandlers[id]
    }

    setBtnState(id, state) {
        if(this.btnStateHandlers[id]){
            this.btnStateHandlers[id](state)
        }
    }


    subscribeProgress(id, handler) {
        if (this.progressSubscribers[id]) {
            this.progressSubscribers[id].push(handler);

        } else {
            this.progressSubscribers[id] = [handler];
        }
    }

    unSubscribeProgress(id, handler) {
        this.progressSubscribers[id] = this.progressSubscribers[id].filter(fun => fun !== handler);
    }

    setProgress(progress) {
        this.current.progress = progress;
        this.spreadProgressChanges();
    }

    spreadProgressChanges(){
        const {id, progress} = this.current;
        for (let handler of this.progressSubscribers[id]) {
            handler(progress);
        }
        for (let handler of this.progressSubscribers['#'] || []) {
            handler(progress);
        }
    }

    addProgressProvider(id, handler) {
        this.progressProviders[id] = handler;
    }

    removeProgressProvider(id) {
        delete this.progressProviders[id];
    }

    getProgress(id) {
        if (!id) {
            return this.getProgress(this.current.id);
        }
        return this.progressProviders[id]();
    }

    setBuffered(buffered) {
        if (this.current.id) {
            this.current.buffered = buffered;
        }
        this.spreadBufferChanges();
    }

    subscribeBuffred(handel) {
        this.bufferedSubscribers.push(handel)
    }

    unSubscribeBuffered(handler) {
        this.bufferedSubscribers = this.bufferedSubscribers.filter(fun =>
            fun !== handler
        );
    }

    spreadBufferChanges() {
        for (let handler of this.bufferedSubscribers) {
            handler(this.current.buffered);
        }
    }
}

export function useRecordPlayer() {
    const [player,] = useState(new Player())

    const api = useMemo(() => {
        return getApi('RecordsStore');
    }, [])

    useEffect(() => {
        player.mediaElement = player.mediaElement || document.createElement('audio');
       // player.mediaElement.type = "audio/mp3";
    }, [player])

    const startUpdateProg = useCallback(() => {
        const handler = setInterval(() => {
            const mediaEl = player.mediaElement;
            const progress = mediaEl.currentTime / (player.current.duration / 1000);
            player.setProgress(progress);
            //--
            const bufferdTimeRanges = mediaEl.buffered;
            if (bufferdTimeRanges.length) {
                const end = bufferdTimeRanges.end(bufferdTimeRanges.length - 1);
                player.setBuffered(end / (player.current.duration / 1000))
            }
        }, 400)
        player.progressUpdaterHandler = handler;
        
    }, [player])

    const stopUpdateProg = useCallback(() => {
        clearInterval(player.progressUpdaterHandler);
    }, [player])

    useEffect(() => {
        const media = player.mediaElement;
        if (media) {
            media.addEventListener("ended", () => {
                if (player.current.state === PLAYBACK_STATE.PLAY) {
                    player.setCurrent({
                        ...player.current,
                        state: PLAYBACK_STATE.PAUSE,
                    })
                    player.setBtnState(player.current.id, PLAYBACK_STATE.PAUSE)
                }
                stopUpdateProg();
                console.log("media element ended event")
            })
            media.addEventListener('progress', () => {
                const bufferdTimeRanges = media.buffered;
                if (bufferdTimeRanges.length) {
                    const end = bufferdTimeRanges.end(bufferdTimeRanges.length - 1);
                    player.setBuffered(end / (player.current.duration / 1000))
                }
            })
        }
    }, [player, stopUpdateProg])

    const playback = useCallback((id, pbState) => {
        const media = player.mediaElement;
        const current = (id) ? false : true;
        id = id || player.current.id;
        if (!id) {
            return;
        }

        if (pbState === PLAYBACK_STATE.PLAY) {
            let  progress, duration; 
            if(current) {
                ({progress, duration } = player.getProgress("#"));
            } else {
                ({progress, duration } = player.getProgress(id));
            }
            const position = (duration / 1000) * progress;
            media.src = api.getRecordUrl(id);
            media.currentTime = position;
            media.play().catch(err => console.log('Play action was aborded' + err));
            if (player.current.id && !current) {
                player.setBtnState(player.current.id, PLAYBACK_STATE.PAUSE)
            }
            player.setCurrent({
                id,
                duration,
                progress: progress,
                buffered: 0,
                state: PLAYBACK_STATE.PLAY,
            })
            startUpdateProg()
        } else if (pbState === PLAYBACK_STATE.PAUSE) {
            if (media.readyState >= 2) {
                media.pause();
            } else {
                media.load();
            }

            player.setCurrent({
                ...player.current,
                state: PLAYBACK_STATE.PAUSE
            })
            stopUpdateProg();
        }
        if (current) {
            player.setBtnState(id, pbState)
        }
    }, [api,
        player,
        stopUpdateProg,
        startUpdateProg,
    ])

    const seek = useCallback(({
        id = player.current.id,
        progress,
        duration = player.current.duration
    }) => {

        const mediaEl = player.mediaElement;

        if (!id || !duration) {
            return;
        }



        if (player.current.id && player.current.id !== id) {
            player.setBtnState(player.current.id, PLAYBACK_STATE.PAUSE);
        }
        const position = (duration / 1000) * progress;

        if (isNaN(position)) {
            return;
        }

        stopUpdateProg();

        if (player.current.id !== id) {
            mediaEl.src = api.getRecordUrl(id);
            mediaEl.currentTime = position;
            player.setBtnState(id, PLAYBACK_STATE.PLAY);
            player.setCurrent({
                ...player.current,
                id,
                duration,
                state: PLAYBACK_STATE.PLAY
            })
            player.setProgress(progress);
        }

        mediaEl.currentTime = position;
        if (mediaEl.pause) {
            mediaEl.play().catch(err => console.log('Play action was aborded' + err));
            player.setBtnState(player.current.id, PLAYBACK_STATE.PLAY);
            player.setCurrent({
                ...player.current,
                state: PLAYBACK_STATE.PLAY
            })
        }
        startUpdateProg();
    }, [player, api, stopUpdateProg, startUpdateProg])

    const setVolume = useCallback((level) => {
        const mediaElement =  player.mediaElement;
        if (!mediaElement) {
            return;
        }
        mediaElement.volume = level;
    }, [player])

    const stop = useCallback(() => {
        const mediaElement =  player.mediaElement;
        mediaElement.load();
    }, [player])

    const controls = {
        playback,
        seek,
        setVolume,
        stop,
    }

    return [
        controls,
        player
    ]
}