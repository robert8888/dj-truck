import React, {useEffect} from "react";
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
import CollapseButton from "./Settings/CollapseButton/CollpaseButton";
import ConsoleCtx from "./ConsoleCtx";
import "./console.scss";
import useDynamicFooter from "../../../common/Hooks/useDynamicFooter";
import ScrollSnapButton from "./Settings/ScrollSnapButton/ScrollSnapButton";

const Console = ({callStopAll, consoleCollapse }) => {
    const setFooter = useDynamicFooter()
    const [control] = usePlayer();

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
            <ConsoleCtx.Provider value={{collapse: consoleCollapse}}>
                <div className={"component console console--" + (consoleCollapse ? "collapsed" : "expanded")}>
                    <div className={"configuration"}>
                        <ControlMenu/>
                        {/*<Mastering />*/}
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