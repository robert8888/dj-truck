import {useMemo, useEffect, useState, useCallback} from "react";
import layoutStyle from "css/layout.scss";

export default function useScreenSize(){
    const breakPoints = useMemo(() => JSON.parse(layoutStyle.breakPoints.slice(1,-1)), [])
    const [screenSize, setScreenSize] = useState(null);

    const onMediaChange = useCallback((size, e) => {
        if(e.matches){
            setScreenSize(size);
        }
    }, [setScreenSize])

    useEffect(() => {
        for(const screenSize in breakPoints){
            const media = window.matchMedia(breakPoints[screenSize]);
            media.addEventListener("change", onMediaChange.bind(null, screenSize))
            if(media.matches)
                onMediaChange(screenSize, media)
        }
    }, [breakPoints, onMediaChange])

    return screenSize;
}
