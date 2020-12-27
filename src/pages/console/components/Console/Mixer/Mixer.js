import React, {useContext} from "react";
import Channel from "./Channel/Channel";
import Fader from "./Fader/Fader";
import ErrorBoundary from "pages/common/components/ErrorBoundary/ErrorBoundary";
import ConsoleCtx from "./../ConsoleCtx";
import classNames from "classnames";
import "./mixer.scss"
import LayoutContext from "../../../../common/Layout/LayoutContext";

const Mixer = () => {
    const {collapse} = useContext(ConsoleCtx)
    const {mode, screen} = useContext(LayoutContext);

    const containerClassNames = classNames(
        "mixer", `mixer--${mode}`, `mixer--${screen}`,
        {
            "mixer--collapsed": collapse,
            "mixer--expanded": !collapse,
        }
    )

    return (
        <ErrorBoundary>
                <div className={containerClassNames}>
                    <Channel name="A" layout={{mode, screen}}/>
                    <Channel name="B" layout={{mode, screen}}/>
                    <Fader />
                </div>
        </ErrorBoundary>
    )
}



export default Mixer;