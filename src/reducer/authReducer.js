const initialState = {
    isLoggedIn: false,
    userId: '',
    token: '',
    refreshToken: '',
    expiresOn: '',
    data: '',
    isLoading: false,
};

export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_LOGIN_STATE":
            return {
                ...state,
                ...action.payload, // this is what we expect to get back from API call and login page input
                isLoggedIn: true, // we set this as true on login
                isLoading: false,
                token: action.payload.data.token.accessToken,
                name: action.payload.data.user.name,
                id: action.payload.data.user.id,
                role: action.payload.data.token.token.scopes[0],
                company: action.payload.data.user.company,
                scopes: action.payload.data.token.token.scopes
            };
        case "PREPARE_LOGIN":
            return {
                ...state,
                isLoading: true,
            }
        case "SET_LOGOUT_STATE":
            return {
                ...state,
                isLoggedIn: false,
                isLoading: false,
            }
        case "CREATE_SESSION_ERROR":
            return {
                ...state,
                isLoading: false
            }
        default:
            return state
    }
};