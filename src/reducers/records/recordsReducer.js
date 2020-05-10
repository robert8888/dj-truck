import {ACTIONS} from "./../../actions";
import {produce} from "imer";


const initState={
    list: [],
    countAll: null,
    currentRecord: null,

    deleteStatus: "IDLE",
}

export default function recordsReducer(state = initState, action){
    switch(action.type){
        case ACTIONS.RECS_LOAD : {
            const nextState = {
                ...state,
                list : action.records,
            }
            if(action.countAll !== null && action.countAll !== undefined){
                nextState.countAll = action.countAll;
            }
            return nextState;
        }

        case ACTIONS.RECS_SET_DATA: {
            const nextState = {
                ...state,
                currentRecord: action.recData,
            }   
            return nextState;
        }

        case ACTIONS.RECS_SET_DELETE_STATUS: {
            const nextState = {
                ...state,
                deleteStatus : action.status,
            }
            return nextState;
        }

        case ACTIONS.RECS_POST_COMMENT: {
            console.log("commment datais" , action.commentData)
            return produce(state, draftState => {
                const comments = state.currentRecord.comments;
                comments.push(action.commentData);
                draftState.currentRecord.comments = comments;
            })
        }

        case ACTIONS.RECS_UPDATE_COMMENT: {
            return produce(state, draftState => {
                draftState.currentRecord.comments = 
                    state.currentRecord.comments.map(comment => {
                        if(comment.id === action.commentData.id){
                            comment.text = action.commentData.text;
                        } 
                        return comment;
                    })
            })
        }

        case ACTIONS.RECS_DELETE_COMMENT: {
            return produce(state, draftState => {
                draftState.currentRecord.comments = 
                     state.currentRecord.comments.filter(comment => comment.id !== action.commentId)
            })
        }

        case ACTIONS.RECS_ADD_FAVORITE : {
            const {recordId} = action;
            return produce(state, draftState =>{
                if(state.currentRecord?.id === recordId) {
                    draftState.currentRecord.favorited = true;
                }
                draftState.list = state.list.map( record => {
                    if(record.id === recordId){
                        record.favorited = true;
                    }
                    return record;
                })
            })
        }

        case ACTIONS.RECS_RM_FAVORITE:{
            const {recordId} = action;
            return produce(state, draftState =>{
                if(state.currentRecord?.id === recordId) {
                    draftState.currentRecord.favorited = false;
                }
                draftState.list = state.list.map( record => {
                    if(record.id === recordId){
                        record.favorited = false;
                    }
                    return record;
                })
            })
        }

        default: return state;
    }
}

