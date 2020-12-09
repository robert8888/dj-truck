import React, {useCallback} from "react";


const HoldButton = ({className, children, onHold, onRelease}) =>{

    const mouseDown = useCallback(()=>{
        onHold();

        const release = () => {
            onRelease();
            window.removeEventListener("mouseup", release);
            window.removeEventListener("mouseleave", release)
        }

        window.addEventListener("mouseup", release);
        window.addEventListener("mouseleave", release);
    }, [onHold, onRelease])

    return (
        <button className={className} onMouseDown={mouseDown}>
            {children}
        </button>
    )
}

export default HoldButton;