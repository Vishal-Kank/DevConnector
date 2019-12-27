import axios from 'axios';
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

//Load User
export const loadUser = () => async dispatch => {
    if (localStorage.token) setAuthToken(localStorage.token);

    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

//Register User
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('api/users', body, config);//posted for backend...
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;//returns array of errors
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
};

//Login User
export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('api/auth', body, config);//posted for backend...
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;//returns array of errors
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: LOGIN_FAIL
        })
    }
};

//Logout & Clear Profile
export const logout = () => dispatch => {
    console.log('logout')
    dispatch({ type: LOGOUT });
};