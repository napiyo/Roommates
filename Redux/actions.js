import * as actionType from './actionTypes'
export function userLoggedIn(Name, Email, uid, DPurl,roomId) {
    return {
        type: actionType.LoggedIn,
        payload: {
            Name,
            Email,
            uid,
            DPurl,
            roomId,
           
        }
    }
}

export function userLoggedOut() {
    return {
        type: actionType.LoggedOut,
        payload: {
            Name: null,
            Email: null,
            uid: null,
            DPur: null,
           
        }
    }
}