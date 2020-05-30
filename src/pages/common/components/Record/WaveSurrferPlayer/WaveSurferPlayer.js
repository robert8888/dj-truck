import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WaveSurfer from "wavesurfer";
import useWindowSize from "../../../Hooks/useWindowSize";
import style from "./wave-surfer-player.scss";

const WaveSurferPlayer = ({ record: { peaks, id, duration },  seek , player }) => {
    const [container, setContainer] = useState(null);
    const containerRef= useRef();
    const [ws, setWs] = useState(null);
    const [progress, setProgress] = useState(0);
    const _progress = useRef();
    const [loaded, setLoaded] = useState(false);
    const [windowWidth, ] = useWindowSize();
    
    const cachedWidth = useRef();
 
    const getContainerWidth = useCallback(()=>{
        if(!cachedWidth.current){
            cachedWidth.current = container?.getBoundingClientRect().width;
        }
        return cachedWidth.current;
    }, [container])

    const setProgressMiddleware = useCallback((progress)=>{
        setProgress(progress);
        _progress.current = progress;
    },[setProgress])    

    const setContainerRef = useCallback((ref) => {
        setContainer(ref);
        containerRef.current = ref;
    }, [setContainer, containerRef])

    const drawPeaks = useCallback((container, peaks, ws) => {
        if(!container || !peaks || !ws   ){
            return;
        }
        let width = getContainerWidth();
        const start = 0;
        const end = peaks.length / 2;
        if (window.devicePixelRatio) {
            width *= window.devicePixelRatio;
        }
        ws.drawer.drawPeaks(peaks, width, start, end);
        setLoaded(true)
    }, [setLoaded, getContainerWidth])

    useEffect(() => {
        if(!container || loaded || container.hasChildNodes() || !player){
            return;
        }

        const ws = new Promise((res, rej) => {
            try {
                const ws = WaveSurfer.create({
                    container: container,
                    barWidth: 2,
                    height: 100,
                    waveColor: style.waveColor,
                    progressColor: style.progressColor,
                    barMinHeight: 0,
                    hideScrollbar: true,
                    cursorColor: 'transparent'
                })
                res(ws)
            } catch (err) {
                rej(err)
            }
        })
        ws.then(ws => {
            setWs(ws);
            return ws;
        })

        ws.then((ws) => {
            if (peaks) {
                drawPeaks(container, peaks, ws);
                if(id === player.getCurrent().id){
                    setProgressMiddleware(player.getCurrent().progress)
                }
                setLoaded(true)
            }
            if (seek) {
                ws.on('seek', (progress) => {
                    seek({
                        id,
                        progress,
                        duration,
                    })
                    ws.drawer.progress(progress);
                })
            }
        })
        
    }, [
        id, 
        seek,
        peaks,
        player,
        duration, 
        container,
        setProgressMiddleware, 
        setWs, 
        drawPeaks, 
        loaded])



    useEffect(() => {
        if (ws && progress) {
            ws.drawer.progress(progress);
        }
    }, [ws, progress])

    const getProgressData = useCallback(() => {
        return {
            duration,
            progress: _progress.current || 0,
        }
    }, [duration, _progress])

    useEffect(() => {
        if (!player) {
            return;
        }
        player.subscribeProgress(id, setProgressMiddleware);
        player.addProgressProvider(id, getProgressData);
        return () => {
            player.unSubscribeProgress(id, setProgressMiddleware);
            player.removeProgressProvider(id);
        }
    }, [id, player, getProgressData, setProgressMiddleware])


    const [isMounted, setMounted] = useState(false);
    useEffect(()=>{
        setMounted(true);
        return () => setMounted(false);
    }, [setMounted])

    const debouncedUpdate = useMemo(()=>{
        cachedWidth.current = null
        return debounce(drawPeaks.bind(null, container, peaks, ws), 500)
    }, [ws, peaks , container, drawPeaks, cachedWidth])

    useEffect(()=>{
        if(loaded && container && isMounted){
            //debouncedUpdate();
        }
    }, [windowWidth, loaded, debouncedUpdate, isMounted, container])

    return (
        <div key={"ws" + id} className="ws-player-container" ref={setContainerRef} />
    )
}

export default WaveSurferPlayer