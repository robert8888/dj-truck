import {useLayoutEffect, useState, useCallback} from "react";

export default function useWindowSize(){
    const [size, setSize] = useState([0,0]);

    const updateSize = useCallback(()=>{
        setSize([window.outerWidth, window.outerHeight])
    }, [setSize])

    useLayoutEffect(() => {
        window.addEventListener('resize', updateSize)
        return () => {
            window.removeEventListener('resize', updateSize);
        }
    })
 
    return size;
}