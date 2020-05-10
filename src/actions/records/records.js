
//--------- Displayling Records----------------

const ACTIONS = {
    RECS_REQ_RECS: "Request for records of current user",
    RECS_LOAD: "Load records from request to state",
    RECS_REQ_FAILS: "set fail status to records list",

    RECS_REQ_DATA: "Request for full data of record",
    RECS_SET_DATA: "Set data of current record",

    RECS_REQ_UPDATE: "Request record update",
    RECS_UPDATE: "Update record in store",
    RECS_REQ_UPDATE_FAIL: "Problem during updating record data",

    RECS_REQ_DELETE: "Request delete record from database",
    RECS_SET_DELETE_STATUS: "Set delete status if is kind  of positive make redirect otherwise inform about err",

    RECS_REQ_POST_COMMENT: "Request to post comment under record",
    RECS_POST_COMMENT: "post comment uder record",
    RECS_REQ_UPDATE_COMMENT: "Request to change comment content",
    RECS_UPDATE_COMMENT: "change comment content",
    RECS_REQ_DELETE_COMMENT: "Request to delete comment uder record",
    RECS_DELETE_COMMENT: "delete comment of current record",

    RECS_REQ_ADD_FAVORITE: "request to add record to user favorite",
    RECS_ADD_FAVORITE: "add record to favorite",
    RECS_REQ_RM_FAVORITE: "request to remove record from favorite 'list' ",
    RECS_RM_FAVORITE: "remove record from favorite"
}
export { ACTIONS as RECORDS_ACTIONS };

export function reqRecs(pageSize, page, where) {
    return { type: ACTIONS.RECS_REQ_RECS, pageSize, page, where }
}

export function reqRecData(recId) {
    return { type: ACTIONS.RECS_REQ_DATA, recId }
}

export function setRecData(recData) {
    return { type: ACTIONS.RECS_SET_DATA, recData }
}

export function loadRecords(records, countAll) {
    return { type: ACTIONS.RECS_LOAD, records, countAll }
}

export function recReqFails(reason) {
    return { type: ACTIONS.RECS_REQ_FAILS, reason }
}


export function reqUpdateRec(recordId, recordChanges) {
    return { type: ACTIONS.RECS_REQ_UPDATE, recordId, recordChanges }
}

export function updateRec(recordId, recordChanges) {
    return { type: ACTIONS.RECS_UPDATE, recordId, recordChanges }
}

export function updateRecFail(recordTitle, reason) {
    return { type: ACTIONS.RECS_REQ_UPDATE_FAIL, recordTitle, reason }
}



export function reqDeleteRec(recordId) {
    return { type: ACTIONS.RECS_REQ_DELETE, recordId };
}

export function setRecDeleteStatus(status) {
    return { type: ACTIONS.RECS_SET_DELETE_STATUS, status }
}

///--------
export function reqPostComment(commentData) {
    return { type: ACTIONS.RECS_REQ_POST_COMMENT,commentData }
}

export function postComment(commentData) {
    return { type: ACTIONS.RECS_POST_COMMENT, commentData }
}

export function reqUpdateComment(commentData) {
    return { type: ACTIONS.RECS_REQ_UPDATE_COMMENT, commentData }
}

export function updateComment(commentData) {
    return { type: ACTIONS.RECS_UPDATE_COMMENT, commentData }
}

export function reqDeleteComment(commentId) {
    return { type: ACTIONS.RECS_REQ_DELETE_COMMENT, commentId }
}

export function deleteComment(commentId) {
    return { type: ACTIONS.RECS_DELETE_COMMENT, commentId }
}

//-------------------------------
export function reqAddRecordToFavorite(recordId){
    return {type : ACTIONS.RECS_REQ_ADD_FAVORITE, recordId}
}

export function addRecordToFavorite(recordId){
    return {type: ACTIONS.RECS_ADD_FAVORITE, recordId}
}

export function reqRemoveRecordFromFavorite(recordId){
    return {type: ACTIONS.RECS_REQ_RM_FAVORITE, recordId}
}

export function removeRecordFromFavorite(recordId){
    return {type: ACTIONS.RECS_RM_FAVORITE, recordId}
}