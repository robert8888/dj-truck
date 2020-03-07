import { ACTIONS } from "../actions";

const initState = {
    searchString: "",
    searchResults: []
}

function searchReducer(state = initState, action){
    switch(action.type){
        case ACTIONS.SEARCH_INPUT : 
        return {
            ...state, 
            searchString : action.text
        }

        case ACTIONS.SET_SEARCH_RESULTS : 
        return {
            ...state,
            searchResults : action.results,
        }

        case ACTIONS.CLEAR_SERACH : 
        return {
            ...initState
        }

        default : return state;
    }
}

export default searchReducer;