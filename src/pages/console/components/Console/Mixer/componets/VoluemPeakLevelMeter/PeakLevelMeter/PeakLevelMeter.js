import React, {useEffect, useRef, useCallback} from "react";
import roundedRect from "./utils/CanvasContextRoundedRect";
import style from "./peak-level-meter.scss"


const PeakLevelMeter = ({aspect, interface: levelInterface, active, size = 30, zero = 25}) =>{
    active = true;
    const container = useRef(null);
    const canvas = useRef(null);
    const canvasContext = useRef(null);
    const aboardRenderController = useRef(null);

    const render = useCallback( bars =>{
        const cc = canvasContext.current;
        //console.log(bars)
        const height  = cc.canvas.height;
        const width = cc.canvas.width;
        const rHeight =  height / size;
        const rWidth = 10;

        for(let i = 0; i < size; i++){
           cc.rect(0,height - i * rHeight - 2, rWidth, rHeight - 2)
           cc.rect(width - rWidth,height - i * rHeight - 2, rWidth, rHeight - 2)
           if(i < size - zero){
               cc.fillStyle = style.barColorOver;
           } else {
               cc.fillStyle = style.barColor;
           }

           cc.fill();
        }

    }, [canvasContext, style])

    const renderLoop = useCallback(()=>{
        if(aboardRenderController.current.signal.aborted){
            return;
        }
        setTimeout(() => requestAnimationFrame(renderLoop), 30);
        const level = levelInterface.getPeakMeter();
        const ledOn = zero + level.peakdB / 2;

        const bars = [];
        for(let i = 0; i < size; i++){
            i < ledOn ?
                bars.push({left: 1, right: 1}) :
                bars.push({left: 0, right: 0})
        }
        render(bars)
    }, [canvas, aboardRenderController, zero, levelInterface])

    const start = useCallback(()=>{
        levelInterface.startUpdating();
        aboardRenderController.current = new AbortController();
        canvasContext.current = canvas.current.getContext("2d");
        renderLoop();
    }, [renderLoop, aboardRenderController, levelInterface, canvasContext, canvas])

    const stop = useCallback(()=>{
        if(!aboardRenderController.current) return;

        levelInterface.stopUpdating();
        aboardRenderController.current.abort();
        canvasContext.current = null;
    }, [levelInterface, aboardRenderController, canvasContext])

    useEffect(()=>{
        if(!levelInterface) return;
        active ? start() : stop();
        return () => {
            stop()
        }
    }, [active, start, stop, levelInterface])

    useEffect(()=>{
        if(!container.current || !canvas.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            const rect = entries[0].contentRect
            canvas.current.width = rect.width;
            canvas.current.height = rect.height;
        })
        resizeObserver.observe(container.current)
        return () => {
            resizeObserver.disconnect();
        }
    }, [container, canvas])

    return (
        <div className={["peak-level-meter",
            (aspect === "horizontal" ? "peak-level-meter--horizontal" : "peak-level-meter--vertical")
        ].join(" ")}
        ref={container}>
            <canvas ref={canvas} className="peak-level-meter__canvas"/>
        </div>
    )
}

export default PeakLevelMeter;