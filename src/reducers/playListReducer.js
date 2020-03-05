import { ACTIONS } from "../actions/actions";
import { produce } from "imer";

const initState = {
    list: []
}

function playListReducer(state = initState, action){
    switch(action.type){
        case ACTIONS.PUSH_TRACK : {
            let newList = Array.from(state.list);
            newList.push(action.track);
            return {
                ...state,
                list :  newList,
            }
        }

        case ACTIONS.SET_BPM : {
            const source = action.source;
            const id = action.id;
            let index = state.list.findIndex( element => (element.id === id && element.source === source));
            return produce(state, draftState => { draftState.list[index].bpm = action.bpm; })
        }

        default : return state;
    }
}

export default playListReducer;
