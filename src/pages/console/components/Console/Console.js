import React, {useEffect, useMemo} from "react";
import { connect } from "react-redux";
import { consoleStopAll, setFooterType } from "./../../../../actions";
import { usePlayer } from "./../../../common/Hooks/usePlayer";
import Deck from "./Deck/Deck";
import Effector from "./Effector/Effector";
import Mastering from "./Mixer/Master/Master";
import Mixer from "./Mixer/Mixer";
import Recorder from "./Mixer/Recorder/Recorder";
import ErrorBoundary from "./../../../common/components/ErrorBoundary/ErrorBoundary";
import ControlMenu from "./Control/ControlMenu";
import CollapseButton from "./CollapseButton/CollpaseButton";
import ConsoleCtx from "./ConsoleCtx";
import "./console.scss";

const Console = ({callStopAll, updateFooterType, consoleCollapse }) => {
    const [control] = usePlayer();

    useEffect(() =>{
        control.stop();
         return () => {
             console.log("call top all")
            callStopAll()
        }   
    }, [control, callStopAll])

    useEffect(()=> {
        updateFooterType()
    }, [setFooterType])


    return (
        <ErrorBoundary>
            <ConsoleCtx.Provider value={{collapse: consoleCollapse}}>
                <div className={"component console console--" + (consoleCollapse ? "collapsed" : "expanded")}>
                    <div className={"configuration"}>
                        <ControlMenu/>
                        <Mastering />
                    </div>
                    <Recorder />

                    <Effector channel={1} />
                    <Deck name="A">A</Deck>

                    <Mixer />

                    <Effector channel={2} />
                    <Deck name="B">B</Deck>
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
    updateFooterType : () => dispatch(setFooterType("default")),
    callStopAll : () => dispatch(consoleStopAll())
})


export default connect(mapStateToProps, mapDispatchToProps)(Console);