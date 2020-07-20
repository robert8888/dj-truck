import React, {useEffect, useRef} from "react";
import "./resizeble-text.js.scss"

const ResizableText = ({children}) => {
    const container = useRef();
    const wrapper = useRef();

    useEffect(() => {
        if(!children || !wrapper.current || !container.current) return;
        wrapper.current.style.transform = `none`;
        const parentSize = container.current.parentElement.getBoundingClientRect();
        const wrapperSize = wrapper.current.getBoundingClientRect();
        const xRatio = wrapperSize.width / parentSize.width;
        const yRatio = wrapperSize.height / parentSize.height;
        const ratio = Math.max(xRatio, yRatio);
        if(ratio > 1){
            let transform = `scale(${1  / (ratio * 1.1)})`
            if(parentSize.height > parentSize.width * 1.2){
                transform += " rotate(90deg)"
            }
            wrapper.current.style.transform = transform;
        } else {
            wrapper.current.style.transform = `none`
        }
    }, [children, wrapper, container])

    return (
        <div ref={container} className={"resizable__container"}>
            <div ref={wrapper} className={"resizable__wrapper"}>
                {children}
            </div>
        </div>
    )

}

export default ResizableText;