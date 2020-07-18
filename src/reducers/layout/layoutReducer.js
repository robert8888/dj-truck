import produce from "imer";
import { ACTIONS } from "./../../actions";
import {evalValue} from "../console/utils/evalMidiValue";

const FOOTER_TYPES = ["none", "default", "player"]

const initState = {
    header: {
        disable: false,
        hidden: false,
        sticki: true,
    },
    footer: {
        type: FOOTER_TYPES[0],
        display: true,
    },
    consoleCollapse: false,
}

export default function headerState(state = initState, action) {
    switch (action.type) {

        case ACTIONS.LAYOUT_SET_FOOTER_TYPE: {
            let {footerType} = action;
            if(!footerType){
                footerType = FOOTER_TYPES[1]
            }

            if(!FOOTER_TYPES.includes(footerType)){
                return state;
            }
            
            return {
                ...state,
                footer: {
                    ...state.footer,
                    type: footerType,
                }
            }
        }

        case ACTIONS.LAYOUT_SET_HEADER_VAR: {
            const { vars } = action;
            return produce(state, drafState => {
                for (let [name, value] of Object.entries(vars)) {
                    drafState.header[name] = value;
                }
            })
        }

        case ACTIONS.LAYOUT_SET_CONSOLE_COLLAPSE : {
            let {value} = action;
            if(value === undefined) return state;
            if(value === null) value = !state.consoleCollapse;
            if(typeof value === "string"){
                if (parseInt(value) === 100){
                    value = true;
                } else if(parseInt(value) === 0){
                    value = false;
                } else {
                    return state;
                }
            }
            return {
                ...state,
                consoleCollapse: value
            }
        }

        default: return state;
    }
}