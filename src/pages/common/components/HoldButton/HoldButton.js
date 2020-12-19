import React, {useCallback} from "react";


const HoldButton = ({className, children, onHold, onRelease}) =>{

    const pointerDown = useCallback(()=>{
        onHold();

        const release = () => {
            onRelease();
            window.removeEventListener("mouseup", release);
            window.removeEventListener("mouseleave", release);
            window.removeEventListener("touchend", release)
        }

        window.addEventListener("mouseup", release);
        window.addEventListener("mouseleave", release);
        window.addEventListener("touchend", release)
    }, [onHold, onRelease])

    return (
        <button className={className} onMouseDown={pointerDown} onTouchStart={pointerDown}>
            {children}
        </button>
    )
}

export default HoldButton;