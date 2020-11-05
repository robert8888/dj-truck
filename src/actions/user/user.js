const ACTIONS = {
    SET_USER_PROFILE: "Set current profil in store",
    SET_USER_PROFILE_WITH_TOKEN: "Set current profil with token in store",
    REMOVE_USER : "Remove user from store - logout",

    U_REQ_UPDATE_PICTURE: "Request update current user picture",
    U_REQ_UPDATE_NICKNAME: "Reques update current user nickname",
    U_REQ_UPDATE_DESCRIPTION: "Request update current user description",
}
export {ACTIONS as USER_ACTIONS};

export function removeUser(){
    return {
        type: ACTIONS.REMOVE_USER,
    }
}

export function setUserProfile(user){
    console.log("set user")
    return {
        type: ACTIONS.SET_USER_PROFILE,
        user, 
    }
}

export function setUserProfileWithToken(user, token){
    return {
        type: ACTIONS.SET_USER_PROFILE_WITH_TOKEN,
        user, 
        token
    }
}

export function reqUpdatePicture(file){
    return { type : ACTIONS.U_REQ_UPDATE_PICTURE, file}
}

export function reqUpdateNickname(nickname){
    return {type : ACTIONS.U_REQ_UPDATE_NICKNAME, nickname}
}

export function reqUpdateDescription(description){
    return {type: ACTIONS.U_REQ_UPDATE_DESCRIPTION, description}
}