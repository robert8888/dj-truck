import React, {useCallback, useState} from "react";


const HoldButton = ({className, children, onHold, onRelease}) =>{
    const [held, setHeld] = useState(false)

    const pointerDown = useCallback((e)=>{
        onHold(e);

        const release = (e) => {
            onRelease(e);
            window.removeEventListener("mouseup", release);
            window.removeEventListener("mouseleave", release);
            window.removeEventListener("touchend", release);
            setHeld(false)
        }

        window.addEventListener("mouseup", release);
        window.addEventListener("mouseleave", release);
        window.addEventListener("touchend", release)

        setHeld(true)
    }, [onHold, onRelease, setHeld])

    return (
        <button className={className + (held ? " btn--held " : " ")}
                onMouseDown={pointerDown}
                onTouchStart={pointerDown}
                onContextMenu={e => e.preventDefault()}>
            {children}
        </button>
    )
}

export default HoldButton;