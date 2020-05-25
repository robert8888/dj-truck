const ACTIONS = {
    P_REQ_PROFILE: "Request user profile",
    P_SET_PROFILE: "Set profile",
    P_SET_PROFILE_PICTURE : "Set profile picture",
    P_SET_PROFILE_DESCRIPTION : "Set profile description",
    P_SET_PROFILE_NICKNAME : "Set profile nickname",
}
export { ACTIONS as PROFILE_ACTIONS };


export function reqUserProfile(nickname){
    return{ type: ACTIONS.P_REQ_PROFILE, nickname}
}

export function setProfile(profile){
    return { type: ACTIONS.P_SET_PROFILE, profile}
}

export function setProfileDescription(userId, description){
    return {type: ACTIONS.P_SET_PROFILE_DESCRIPTION, userId, description}
}

export function setProfileNickname(userId, nickname){
    return {type: ACTIONS.P_SET_PROFILE_NICKNAME, userId, nickname}
}

export function setProfilePicutre(userId, picture){
    return {type: ACTIONS.P_SET_PROFILE_PICTURE, userId, picture}
}