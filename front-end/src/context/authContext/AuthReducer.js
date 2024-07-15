const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START": {
            return {
                ...state,
                isFetching: true,
                error: false,
            };
        }
        case "LOGIN_SUCCESS": {
            console.log(action.payload);
            return {
                ...state,
                user: action.payload,
                isFetching: false,
                error: false,
            };
        }
        case "LOGIN_FAILURE": {
            return {
                user: null,
                isFetching: false,
                error: true,
                errorMessage: action.payload
            };
        }
        case "LOGOUT": {
            return {
                ...state,
                user: null,
                isFetching: false,
                error: false,
            };
        }
        default: {
            return {...state};
        }
    }
}

export default AuthReducer;