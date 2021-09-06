const initialState = {
    data: [],
};

export const salesReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_DATA_STATE_SALES":
            return {
                ...state,
                ...action.payload,
                data: action.payload
            };
        case "DELETE_SALES":
            return {
                ...state
            }
        case "RESET_DATA_SALES":
            return state
        default:
            return state
    }
};