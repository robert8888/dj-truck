
//--------- Serching----------------

const ACTIONS = {
    SEARCH_INPUT : "Update query text from search component",
    CLEAR_SEARCH : "Clear search string and search result set",
    SEARCH_START : "Fire searching request",
    SET_SEARCH_RESULTS : "Update search results in store",
    SET_SEARCH_STATUS: "Update search status in store",
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
    return {type : ACTIONS.CLEAR_SEARCH}
}

export function setSearchStatus(status){
    return {type : ACTIONS.SET_SEARCH_STATUS, status}
}