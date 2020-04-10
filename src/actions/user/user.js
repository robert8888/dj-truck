const ACTIONS = {
    SET_USER_PROFILE: "Set current profil in store",
    SET_USER_PROFILE_WITH_TOKEN: "Set current profil with token in store",
    REMOVE_USER : "Remove user from store - logout",
}
export {ACTIONS as USER_ACTIONS};

export function removeUser(){
    return {
        type: ACTIONS.REMOVE_USER,
    }
}

export function setUserProfile(user){
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
