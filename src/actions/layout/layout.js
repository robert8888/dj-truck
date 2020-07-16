const ACTIONS = {
    LAYOUT_SET_FOOTER_TYPE: "Seting footer type",
    LAYOUT_SET_HEADER_VAR: "Settin hader variable value",
    LAYOUT_SET_CONSOLE_COLLAPSE: "Set console collapse state"
}

export { ACTIONS as LAYOUT_ACTIONS };


export function setFooterType(footerType) {
    return { type: ACTIONS.LAYOUT_SET_FOOTER_TYPE, footerType }
}


export function setHeaderVar(vars) {
    return { type: ACTIONS.LAYOUT_SET_HEADER_VAR, vars }
}

export function setConsoleState(value){
    return {type : ACTIONS.LAYOUT_SET_CONSOLE_COLLAPSE, value}
}