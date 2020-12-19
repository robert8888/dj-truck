import React, {useEffect, useContext} from "react";
import { connect } from "react-redux";
import { consoleStopAll, setFooterType } from "actions";
import { usePlayer } from "pages/common/Hooks/usePlayer";
import Deck from "./Deck/Deck";
import Effector from "./Effector/Effector";
import Mastering from "./Mixer/Master/Master";
import Mixer from "./Mixer/Mixer";
import Recorder from "./Mixer/Recorder/Recorder";
import ErrorBoundary from "pages/common/components/ErrorBoundary/ErrorBoundary";
import ControlMenu from "./Control/ControlMenu";
import CollapseButton from "./Settings/CollapseButton/CollpaseButton";
import useDynamicFooter from "pages/common/Hooks/useDynamicFooter";
import ScrollSnapButton from "./Settings/ScrollSnapButton/ScrollSnapButton";
import ConsoleCtx from "./ConsoleCtx";
import LayoutContext from "../../../common/Layout/LayoutContext";
import "./console.scss";

const Console = ({callStopAll, consoleCollapse }) => {
    const setFooter = useDynamicFooter()
    const [control] = usePlayer();
    const {mode} = useContext(LayoutContext);

    useEffect(() =>{
        control.stop();
         return () => {
            callStopAll()
        }   
    }, [control, callStopAll])

    useEffect(()=> {
        setFooterType("default")
    }, [setFooter])


    return (
        <ErrorBoundary>
            <ConsoleCtx.Provider value={{
                collapse: consoleCollapse
            }}>
                <div className={"component console " +
                    "console--" + (consoleCollapse ? "collapsed " : "expanded ") +
                    "console--" + mode
                }>
                    <div className={"configuration"}>
                        <ControlMenu/>
                        <Mastering />
                    </div>
                    <Recorder />

                    <Effector channel={1} />
                    <Deck name="A"/>

                    <Mixer />

                    <Effector channel={2} />
                    <Deck name="B"/>
                    <ScrollSnapButton/>
                    <CollapseButton/>
                </div>
            </ConsoleCtx.Provider>
        </ErrorBoundary>
    )
}

const mapStateToProps = state => ({
    consoleCollapse: state.layout.consoleCollapse,
})

const mapDispatchToProps = dispatch =>({
    callStopAll : () => dispatch(consoleStopAll())
})


export default connect(mapStateToProps, mapDispatchToProps)(Console);