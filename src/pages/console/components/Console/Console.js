import React from "react"
import Deck from "./Deck/Deck";
import Mixer from "./Mixer/Mixer";

import "./console.scss";
import Mastering from "./Mixer/Master/Master";
import Effector from "./Effector/Effector";
import Recorder from "./Mixer/Recorder/Recorder";

const Console = props =>{


    return (
        <div className="truck-console">
            <Mastering/>
            <Recorder/>
            <Effector channel={1}/>
            <Deck name="A">A</Deck>
        
            <Mixer />
        
            <Effector channel={2}/>
            <Deck name="B">B</Deck>
           
        </div>
    )
}


export default Console;