import * as actionType from './actionTypes'

const initialState = {
    Name: null,
    Email: null,
    uid: null,
    DPurl: null,
    roomId:null,
  
}

export default (userData = initialState, action) => {
    switch (action.type) {

        case actionType.LoggedIn:
            return {
                Name: action.payload.Name,
                Email: action.payload.Email,
                uid: action.payload.uid,
                DPurl: action.payload.DPurl,
                roomId: action.payload.roomId,
               
            }
        case actionType.LoggedOut:
            return {
                Name: null,
                Email: null,
                uid: null,
                DPurl: null,
                roomId:null,
            
            }
        default:
            return userData
    }
}