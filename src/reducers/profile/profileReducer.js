import { produce } from "imer";
import { set } from "lodash/object";
import { ACTIONS } from "./../../actions";

const initState = {
    current: null,
}

export default function (state = initState, action) {
    switch (action.type) {

        case ACTIONS.P_SET_PROFILE: {
            return {
                ...state,
                current: action.profile
            }
        }

        case ACTIONS.P_SET_PROFILE_DESCRIPTION: {
            const { userId, description } = action;
            return setOnCurrent(state, userId, [{ path:  ['description'], value : description }])
        }

        case ACTIONS.P_SET_PROFILE_NICKNAME: {
            const { userId, nickname } = action;
            console.log("reducer", userId, nickname);
            return setOnCurrent(state, userId, [{ path:  ['user', 'nickname'], value : nickname }])
        }

        case ACTIONS.P_SET_PROFILE_PICTURE: {
            const { userId, picture } = action;
            return setOnCurrent(state, userId, [{ path:  ['user', 'picture'], value: picture }])
        }

        default: return state;
    }
}

function setOnCurrent(state, userId, props) {
    const current = state.current;
    if (!current ||
        !userId ||
        !props ||
        current.user.id !== userId) {
        return state;
    }
    return produce(state, drafState => {
        for (let prop of props) {
            set(drafState.current, prop.path, prop.value)
        }
    })
}