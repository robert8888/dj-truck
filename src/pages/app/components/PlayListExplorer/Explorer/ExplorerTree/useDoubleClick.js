import { useState, useCallback } from "react"

export function useDoubleClickSeparetly({ clickHandler, doubleClickHandler }) {
    const [lastClick, setLastClick] = useState(null);
    const [timerHandler, setTimerHandler] = useState(null);
    const liClickHandler = useCallback((...args) => {
        const now = new Date().getTime();
        if (timerHandler === null) {
            setLastClick(now);
            setTimerHandler(setTimeout(() => {
                clickHandler(...args);
                clearTimeout(timerHandler);
                setTimerHandler(null);
            }, 200))
        } else if (now - lastClick < 200) {
            doubleClickHandler(...args);
            setLastClick(null)
            clearTimeout(timerHandler);
            setTimerHandler(null);
        }
    }, [lastClick,
        setLastClick,
        timerHandler,
        setTimerHandler,
        clickHandler,
        doubleClickHandler])

    return [liClickHandler]
}

export function useDoubleClick({ clickHandler, doubleClickHandler }) {
    const [lastClick, setLastClick] = useState(null);

    const liClickHandler = useCallback((...args) => {
        const now = new Date().getTime();
        setLastClick(now);
        clickHandler(...args);
        if (now - lastClick < 300) {
            doubleClickHandler(...args);
            setLastClick(null)
        }
    }, [lastClick,
        setLastClick,
        clickHandler,
        doubleClickHandler])

    return [liClickHandler]
}