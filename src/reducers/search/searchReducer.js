import { ACTIONS } from "actions";

const initState = {
    searchString: "",
    searchResults: [],
    status: "idle",
}

function searchReducer(state = initState, action){
    switch(action.type){
        case ACTIONS.SEARCH_INPUT : 
        return {
            ...state, 
            searchString : action.text,
            status: "idle"
        }

        case ACTIONS.SET_SEARCH_RESULTS : 
        return {
            ...state,
            searchResults : action.results,
            status: "idle"
        }

        case ACTIONS.SET_SEARCH_STATUS:{
            const {status} = action;
            return {
                ...state,
                status
            }
        }

        case ACTIONS.CLEAR_SEARCH :
        return {
            ...initState
        }

        default : return state;
    }
}

export default searchReducer;