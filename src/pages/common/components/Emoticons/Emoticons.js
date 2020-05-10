import React, { useCallback, useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import icons from "./emoji.json";
import "./emoticons.scss";
const perPanel = 30;

const Emoticons = ({ onSelect, toggle }) => {
    const [iconPanels, setPanels] = useState(null);
    const panelsLen = useRef();
    const [display, setDisplay] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const createPanels = useCallback((from, to) => {
        to = to ?? from + 1;
        if(to * perPanel > icons.length) return;

        let panels = [];
        for (let i = perPanel * from; i < perPanel * to; i += perPanel) {
            let panel = [];
            for (let j = i; (j < perPanel + i) && (j <  icons.length); j++) {
                let icon = icons[j]
                panel.push(
                    <button key={'icon-' + (i + j)} className="emoticons-btn" onClick={onSelect.bind(null, icon.emoji)}>{icon.emoji}</button>
                )
            }
            panels.push(
                <section className="emoticons-panel" key={'pannel-' + i}>
                    {panel}
                </section>
            )
        }
        if(!panelsLen.current){
            panelsLen.current = 0;
        }
        panelsLen.current += panels.length;
        return panels;
    }, [])

    const createNext = useCallback(()=>{
        setPanels( panels => [...panels, createPanels(panelsLen.current)])
    }, [setPanels, createPanels, panelsLen])

    const next = useCallback((event) => {
        event.preventDefault();
        setCurrentSlide(c => {
            if (c + 1 < panelsLen.current) {
                return c + 1;
            }
            return c;
        });
        createNext();
    }, [panelsLen, createNext])

    const prev = useCallback((event) => {
        event.preventDefault();
        setCurrentSlide(c => {
            if (c - 1 > 0) {
                return c - 1;
            }
            return c;
        })
    }, [])

    const toggleHandler = useCallback(() => {
        if (!panelsLen.current) {
            setPanels(createPanels(0, 5));
        }
        setDisplay(display => !display);
    }, [setDisplay, setPanels, panelsLen, createPanels])

    useEffect(() => {
        toggle.current = toggleHandler
    }, [toggle])

    const hide = useCallback(event => {
        if (!event.target.closest('.emoticons-container') &&
            !event.target.closest('.emoticon-btn')) {
                window.removeEventListener('mousedown', hide);
                setDisplay(false)
        }
    }, [setDisplay])

    useEffect(() => {
        if (display) {
            window.addEventListener('mousedown', hide);
        } else {
            window.removeEventListener('mousedown', hide)
        }
    }, [display, setDisplay, hide])

    return (
        <div className="emoticons-container emoticons-popup" style={{display: (display) ? 'block' : 'none' }}>
            <button className="emoticons-nav-btn emoticons-btn-prev" onClick={prev}>
                <FontAwesomeIcon icon={faAngleDoubleLeft} className="emoticons-btn-icon" />
            </button>
            <div className="emoticons-slider">
                <div className="emoticons-slides" style={{ transform: `translateX(-${currentSlide * 210}px)`, transition: 'transform 0.2s' }}>
                    {iconPanels}
                </div>
            </div>
            <button className="emoticons-nav-btn  emoticons-btn-next" onClick={next}>
                <FontAwesomeIcon icon={faAngleDoubleRight} className="emoticons-btn-icon" />
            </button>
        </div>
    )
}

export default Emoticons;