
//--------- Serching----------------

const ACTIONS = {
    SEARCH_INPUT : "Tap in to Search component",
    SET_SEARCH_RESULTS : "Set YT(or oteher source) search results",
    SEARCH_START : "Fire seraching",
    CLEAR_SERACH : "Clear search string and serach result set"
}
export {ACTIONS as SEARCHING_ACTIONS};

export function searchInput(text){
    return {
        type: ACTIONS.SEARCH_INPUT,
        text: text
    }
}

export function searchStart(text){
    return { 
        type : ACTIONS.SEARCH_START,
        text : text
    }
}

export function setSearchResults(results){
    return {
        type: ACTIONS.SET_SEARCH_RESULTS,
        results : results,
    }
}

export function clearSearch(){
    return {
        type : ACTIONS.CLEAR_SERACH
    }
}
