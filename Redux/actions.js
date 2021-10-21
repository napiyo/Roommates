import * as actionType from './actionTypes'
export function userLoggedIn(Name, Email, uid, DPurl) {
    return {
        type: actionType.LoggedIn,
        payload: {
            Name: Name,
            Email: Email,
            uid: uid,
            DPurl: DPurl,
           
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