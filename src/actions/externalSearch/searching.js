
//--------- Serching----------------

const ACTIONS = {
    SEARCH_INPUT : "Update query text from serach component",
    CLEAR_SERACH : "Clear search string and serach result set",
    SEARCH_START : "Fire seraching request",
    SET_SEARCH_RESULTS : "Update search results in store",
}
export { ACTIONS as SEARCHING_ACTIONS };

export function searchInput(text){
    return {
        type: ACTIONS.SEARCH_INPUT,
        text: text
    }
}

export function searchStart(text, source, limit){
    return { 
        type : ACTIONS.SEARCH_START,
        text,
        source,
        limit
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
