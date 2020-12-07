import React, {useRef, useEffect, useState, useCallback} from "react"
import ReactDOM from "react-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";

const PopupImage = ({onClose, src, alt}) =>{
    const container = {
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 1000,
    }
    const wrapper = {
        boxShadow: "0 0 0 100vh rgba(0,0,0,0.5)",
        position: "relative",
        border: "5px solid white"
    }
    const image = {
        maxWidth: "100%",
    }
    const button = {
        position: "absolute",
        right: 0,
        top: 0,
        padding: "clamp(10px, 3vw, 25px)",
        background: "rgba(0,0,0,0.5)",
        color: "white",
        cursor: "pointer"
    }
    return ReactDOM.createPortal((
        <div className={"magnific-img__container"} style={container}>
            <div className={"magnific-img__wrapper"} style={wrapper}>
                <div className={"magnific-img__button"} style={button} onClick={onClose}>
                    <FontAwesomeIcon icon={faTimesCircle}/>
                </div>
                <img style={image} src={src} alt={alt}/>
            </div>
        </div>
    ), document.body)
}

export default function useImageMagnific({
    minResolution = null,
    mobileOnly = false,
}){
    const [isAttached, setAttached] = useState(false);
    const [, setObserved] = useState([])
    const container = useRef();
    const [popup, setPopup] = useState(null);

    const handle = useCallback((event)=>{
        setPopup((
            <PopupImage
                src={event.target.src}
                alt={event.target.alt}
                onClose={setPopup.bind(null, null)}
            />
        ))
    }, [setPopup])

    const observe = useCallback((images)=>{
        setObserved( previous => {
            if(previous)
                for(let img of previous){
                    img.removeEventListener("touchstart", handle);
                    img.removeEventListener("click", handle);
                }
            for(let img of images){
                if(mobileOnly) {
                    img.addEventListener("touchstart", handle)

                } else {
                    img.addEventListener("click", handle);
                }
            }
            return images;
        })
    }, [setObserved, mobileOnly, handle])

    useEffect(()=>{
        if(!minResolution){
            setAttached(true);
            return;
        }
        const onResize = () => {
            if(window.innerWidth < minResolution){
                setAttached(true)
            } else{
                setAttached(false)
            }
        }
        window.addEventListener("resize", onResize);
        onResize();
        return () =>{
            window.removeEventListener("resize", onResize)
        }
    }, [setAttached, minResolution])

    const update = useCallback(()=>{
        const images = [];
        const travers = (node) => {
            for(let child of node.children){
                if(child.tagName === "IMG")
                    images.push(child);
                if(child.children && child.children.length)
                    travers(child);
            }
        }
        travers(container.current)
        observe(images)
    }, [observe])

    useEffect(()=>{
        if(!isAttached || !container.current) return;
        update();
    }, [isAttached, container, update])

    return [container, popup , update]
}