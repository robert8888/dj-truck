import React, {useRef, useEffect, useMemo} from "react";
import PropTypes from "prop-types";
import "./separator.scss";
import {Container} from "react-bootstrap";
import debounce from "lodash/debounce";

const propTypes = {
    placement: PropTypes.oneOf(["top", "bottom"]).isRequired,
    content: PropTypes.element,
}

const Separator = ({placement, content}) =>{
    const square = useRef();
    const separator = useRef();
    useEffect(()=>{
        if(!square.current || !separator.current) return;
        const updateSize = debounce( e => {
            const left = separator.current.getBoundingClientRect().left
            square.current.style.width = (left || 0) + "px";
        }, 32);
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize)
    }, [square, separator])

    return (
        <div className={"separator__wrapper separator__wrapper--" + placement}>
            <div className={"separator__pre-square separator__pre-square--"+placement} ref={square}/>
            <Container className="container-xl">
                {content && <main className={"separator__content"}> {content} </main>}
                <div className={"separator separator--" + placement} ref={separator}/>
            </Container>
        </div>
    );
}

Separator.propTypes = propTypes;

export default Separator;