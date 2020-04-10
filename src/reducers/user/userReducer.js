import {ACTIONS} from "./../../actions";


const initState ={
    logged: false,
    id : null,
    email : null,
    nickname : null,

    token: null,
}


function userReducer(state = initState, action){
    switch(action.type){
        case ACTIONS.SET_USER_PROFILE_WITH_TOKEN : {
            if(action.user.logged && !state.logged){
                return {
                    ...state, 
                    ...action.user,
                    id: action.user.sub,
                    token: action.token
                }
            }
            else return initState;
        }
        case ACTIONS.REMOVE_USER : {
            return {
                ...initState
            }
        }

        default : return state;
    }
}

export default userReducer;
