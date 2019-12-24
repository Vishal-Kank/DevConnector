import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'), // valid token will be stored into local storage in browser
    isAuthenticated: null, // if token is authenticated to access different functions
    loading: false,
    user: null // user data(bio) will be stored here...
}

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case REGISTER_SUCCESS: localStorage.setItem('token', payload.token)
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
            }
        case REGISTER_FAIL: localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        default: return state
    }
}