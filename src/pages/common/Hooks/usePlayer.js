import { useCallback, useEffect, useState } from "react";
import { Log, Logger } from "../../../utils/logger/logger";
import { getApi } from "./../../../apis/apiProvider";
import { PLAYBACK_STATE } from "./usePlabackState";

//getRecordUrl
class PlayerBus {
    constructor() {
        if (!PlayerBus.instance) {
            PlayerBus.instance = this;
        }

        return PlayerBus.instance;
    }


    progressUpdaterHandler = null;

    current = {
        id: null,
        source: "RecordsStore",
        start: 0,
        duration: 0,
        progress: 0,
        state: null,
        buffered: 0,
    };

    playbackSubscirbers = {}
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

    getCurrent() {
        return this.current;
    }

    subscribePlayback(id, handler) {
        this.playbackSubscirbers[id] = handler;
    }

    unSubscribePlayback(id) {
        delete this.playbackSubscirbers[id]
    }

    setPlaybackState(id, state) {
        if (this.playbackSubscirbers[id]) {
            this.playbackSubscirbers[id](state)
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

    spreadProgressChanges() {
        const { id, progress } = this.current;

        for (let handler of this.progressSubscribers['#'] || []) {
            handler(progress);
        }

        if(!this.progressSubscribers[id]) return;
        for (let handler of this.progressSubscribers[id]) {
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

        if(!id || !this.progressProviders[id]){
            return this.current.progress;
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

export function usePlayer() {
    const [player,] = useState(new PlayerBus())


    useEffect(() => {
        player.mediaElement = player.mediaElement || document.createElement('audio');
        // player.mediaElement.type = "audio/mp3";
    }, [player])

    const startUpdateProg = useCallback(() => {
        const handler = setInterval(() => window.requestIdleCallback( () => {
            
            if(player.current.state === PLAYBACK_STATE.PAUSE){
                clearInterval(handler);
            }
            const mediaEl = player.mediaElement;
            if(!player.current.duration) {
                player.setCurrent({
                    ...player.current,
                    duration : mediaEl.duration * 1000
                })
            }
            const progress = mediaEl.currentTime / (player.current.duration / 1000);
            player.setProgress(progress);
            //--
            const bufferdTimeRanges = mediaEl.buffered;
            if (bufferdTimeRanges.length) {
                const end = bufferdTimeRanges.end(bufferdTimeRanges.length - 1);
                player.setBuffered(end / (player.current.duration / 1000))
            }
        }, {timeout: 20}), 400)
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
                    player.setPlaybackState(player.current.id, PLAYBACK_STATE.PAUSE)
                }
                stopUpdateProg();
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

    const playback = useCallback((id, pbState, source) => {
        id = id || player.current.id;
        source = source || player.current.source || "RecordsStore";
        const api = getApi(source);
        const media = player.mediaElement;
        const isCurrent = id === player.current.id;
        
        if (!id) {
            return;
        }

        console.log("playback", id, pbState, source)
        if (pbState === PLAYBACK_STATE.PLAY) {
            let progress, duration;
            if (isCurrent) {
                ({ progress, duration } = player.getProgress("#"));
            } else {
                ({ progress, duration } = player.getProgress(id));
            }
            const position = (duration / 1000) * progress;
            media.src = api.getStreamUrl(id);
            
            if(!isNaN(position)){
                media.currentTime = position;
            }
            
            media.play().catch(error => {
                Logger.push(Log.Error(
                    ['usePlayer', 'playback method'], 
                    'Media element play method error' + error.message,
                    error))
            });

            if (player.current.id && !isCurrent) {
                player.setPlaybackState(player.current.id, PLAYBACK_STATE.PAUSE)
            }

            player.setCurrent({
                id,
                source,
                duration,
                progress,
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

        if (isCurrent) {
            player.setPlaybackState(id, pbState)
        }

    }, [player,
        stopUpdateProg,
        startUpdateProg,
    ])

    const seek = useCallback(({
        id = player.current.id,
        progress,
        duration = player.current.duration,
        source = 'RecordsStore',
    }) => {
        
        const mediaEl = player.mediaElement;
        const api = getApi(source);

        if (!id || !duration) {
            return;
        }

        if (player.current.id && player.current.id !== id) {
            player.setPlaybackState(player.current.id, PLAYBACK_STATE.PAUSE);
        }
        const position = (duration / 1000) * progress;

        if (isNaN(position)) {
            return;
        }

        stopUpdateProg();

        if (player.current.id !== id) {
            mediaEl.src = api.getStreamUrl(id);
            mediaEl.currentTime = position;
            player.setPlaybackState(id, PLAYBACK_STATE.PLAY);
            player.setCurrent({
                ...player.current,
                id,
                source,
                duration,
                state: PLAYBACK_STATE.PLAY
            })
            player.setProgress(progress);
        }

        mediaEl.currentTime = position;
        if (mediaEl.pause) {
            mediaEl.play().catch(err => console.log('Play action was aborded' + err));
            player.setPlaybackState(player.current.id, PLAYBACK_STATE.PLAY);
            player.setCurrent({
                ...player.current,
                state: PLAYBACK_STATE.PLAY
            })
        }
        startUpdateProg();
    }, [player, stopUpdateProg, startUpdateProg])

    const setVolume = useCallback((level) => {
        const mediaElement = player.mediaElement;
        if (!mediaElement) {
            return;
        }
        mediaElement.volume = level;
    }, [player])

    const stop = useCallback(() => {
        const mediaElement = player.mediaElement;
        mediaElement.load();
        player.setCurrent({
            ...player.current,
            state:PLAYBACK_STATE.PAUSE,
        })
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