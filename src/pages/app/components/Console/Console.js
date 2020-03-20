import React from "react"
import Deck from "./Deck/Deck";
import Mixer from "./Mixer/Mixer";

import "./console.scss";
import Recorder from "./Recorder/Recorder";
import Effector from "./Effector/Effector";

const Console = props =>{


    return (
        <div className="truck-console">
            <Recorder/>
            <div className="console-group group-deck group-deck-A">
                <Effector channel={1}/>
                <Deck name="A">A</Deck>
            </div>
                <Mixer />
            <div className="console-group group-deck group-deck-B">
                <Effector channel={2}/>
                <Deck name="B">B</Deck>
            </div>
        </div>
    )
}


export default Console;