import React, {useCallback, useEffect, useState} from "react";
import SwitchButton from "pages/common/components/SwitchButton/SwitchButton";
import "./scoll-snap-button.scss";
import {useSelector} from "react-redux";

const ScrollSnapButton = () => {
    const userId = useSelector(state => state.user.id);
    const [scroll, setScroll] = useState(false);

    useEffect(()=>{
        const html = document.querySelector("html");

        if(scroll){
            html.classList.add("scroll-snap");
        } else {
            html.classList.remove("scroll-snap")
        }
    }, [scroll])

    const updateScroll = useCallback((value)=>{
        setScroll(value)
        localStorage.setItem("scroll-snap-" + userId, value)
    }, [setScroll, userId])

    useEffect(() => {
        setScroll(localStorage.getItem("scroll-snap-" + userId) === "true")
    }, [setScroll, userId])

    return (
        <div className={"c-scroll-snap-switch__container"}>
            <div className={"c-scroll-snap-switch__wrapper"} data-tooltip={"Scroll snap " + (scroll ? "on" : "off")}>
                <SwitchButton
                    className={"c-scroll-snap-switch"}
                    onChange={updateScroll}
                    value={scroll}/>
            </div>
        </div>
    )
}

export default ScrollSnapButton;