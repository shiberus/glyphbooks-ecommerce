import { LOGIN, LOGOUT } from "../constants/user.constants";

const initialState = { user: "guest" };

function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        user: action.user,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        user: "guest",
      };
    }
    default:
      return state;
  }
}

export default userReducer;
