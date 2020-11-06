import React from "react";
import "./spacer.scss";

const Spacer = () =>{
    return (
        <div className={"spacer"}>
            <div className={"spacer__stairs"}>
                <div className="aspect-30">
                    <div className="spacer__stairs__fill"/>
                </div>
            </div>
            <div className="spacer__full-height-fill"/>
        </div>
    )
}

export default Spacer