import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_ALERT:
            return [...state, payload];

        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);// will return state (i.e an array here) which will have all alerts which is not equal to the payload(payload here is alert id).

        default:
            return state;
    }
}