import React, {useContext} from "react";
import BinaryButton from "../../../../../common/components/BinnaryButton/BinnaryButton";
import {setPitchInKey} from "./../../../../../../actions";
import DeckContext from "./../DeckCtx";
import "./pitch-in-key-button.js.scss"

const PitchInKeyButton = () => {
    const deckContext = useContext(DeckContext);
    return (
        <BinaryButton
            className={"btn--in-key btn--" + deckContext.channel}
            get={state => state.console.channel[deckContext.channel].deckState.inKey}
            set={value => setPitchInKey(deckContext.channel, !!value)}>
                key
        </BinaryButton>
    )
}

export default PitchInKeyButton;