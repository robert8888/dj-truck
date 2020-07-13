import React from "react";
import {MAPPING, setDryWet} from "./../../../../../actions";
import DryWetKnob from "./components/DryWetKnob/DryWetKnob";
import ErrorBoundary from "../../../../common/components/ErrorBoundary/ErrorBoundary";
import EffectSelector from "./components/EffectSelector/EffectSellector";
import EffectParams from "./components/EffectParams/EffectParams";
import "./effector-channel.scss";

const Effector = ({ channel}) => {
    return (
        <ErrorBoundary>
            <div className={"component effector ch-" + channel}>
                <span className="component__label">{"FX " + channel}</span>
                <DryWetKnob get={ state => state.effector.channels[channel].dryWet.current}
                            set={ value => setDryWet(channel, value)}
                            role={MAPPING[`EFFECTOR_CHANNEL_${channel}_DW`]}/>
                <EffectSelector className={"effect-selector"}
                                channel={channel}
                                role={MAPPING[`EFFECTOR_CHANNEL_${channel}_EFFECT`]}/>
                <EffectParams channel={channel}/>
            </div>
        </ErrorBoundary>
    )
}

export default Effector;


