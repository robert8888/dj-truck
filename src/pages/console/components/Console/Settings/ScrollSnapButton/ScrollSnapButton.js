import React, {useEffect, useState} from "react";
import SwitchButton from "../../../../../common/components/SwitchButton/SwitchButton";
import "./scoll-snap-button.scss";

const ScrollSnapButton = () => {
    const [scroll, setScroll] = useState(false);

    useEffect(()=>{
        const html = document.querySelector("html");

        if(scroll){
            html.classList.add("scroll-snap");
        } else {
            html.classList.remove("scroll-snap")
        }
    }, [scroll])

    return (
        <div className={"c-scroll-snap-button__container"}>
            <div className={"c-scroll-snap-button__wrapper"} data-tooltip={"Scroll snap " + (scroll ? "on" : "off")}>
                <SwitchButton
                    className={"c-scroll-snap-button"}
                    onChange={setScroll}
                    value={scroll}/>
            </div>
        </div>
    )
}

export default ScrollSnapButton;