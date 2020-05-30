import produce from "imer";
import { ACTIONS } from "./../../actions";

const FOOTER_TYPES = ["default", "player"]

const initState = {
    header: {
        disable: false,
        hidden: false,
        sticki: true,
    },
    footer: {
        type: FOOTER_TYPES[0],
        display: true,
    }
}

export default function headerState(state = initState, action) {
    switch (action.type) {

        case ACTIONS.LAYOUT_SET_FOOTER_TYPE: {
            let {type} = action;
            if(!type){
                type = FOOTER_TYPES[0]
            }

            if(!FOOTER_TYPES.includes(type)){
                return state;
            }
            
            return {
                ...state,
                footer: {
                    ...state.footer,
                    type: action.type,
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

        default: return state;
    }
}