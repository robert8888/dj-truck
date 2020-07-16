import React, {useMemo} from "react";
import {connect} from "react-redux";
import ConsoleContext from "./ConsoleCtx"

const ConsoleContextProvider = ({collapse, children}) => {
    const consoleContext = useMemo(()=>({
        collapse: collapse
    }), [collapse])


    return (
        <ConsoleContext.Provider value={consoleContext}>
            {children}
        </ConsoleContext.Provider>
    )
}

const mapStateToProps = state => ({
    consoleCollapse: state.layout.consoleCollapse,
})

export default connect(mapStateToProps)(ConsoleContextProvider);