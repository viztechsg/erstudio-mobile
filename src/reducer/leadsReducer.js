const initialState = {
    data: [],
};

export const leadsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_DATA_STATE":
            return {
                ...state,
                ...action.payload,
                data: action.payload
            };
        case "DELETE_LEAD":
            return {
                ...state
            }
        case "RESET_DATA":
            return state
        default:
            return state
    }
};