import { useReducer } from "react";
import { UserContext } from "./UserContext";

const intialState = {
  SignUp: {
    userId: "",
    name: "",
    email: "",
    password: "",
  },
  SignIn: {
    userId: "",
    email: "",
    password: "",
  },
  adminSignIn: {
    adminId: "",
    name: "",
  },
  user: null,
  message: {
    type: null,
    text: "",
  },
  isLoading: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SignUp":
      return {
        ...state,
        SignUp: { ...state.SignUp, [action.payload.id]: action.payload.value },
      };
    case "SignIn":
      return {
        ...state,
        SignIn: { ...state.SignIn, [action.payload.id]: action.payload.value },
      };
    case "adminSignIn":
      return {
        ...state,
        adminSignIn: {
          ...state.adminSignIn,
          [action.payload.id]: action.payload.value,
        },
      };
    case "user":
      return { ...state, user: action.payload };
    case "setMessage":
      return {
        ...state,
        message: { type: action.payload.type, text: action.payload.text },
      };
    case "isLoading":
      return { ...state, isLoading: action.payload };
    case "clearMessage":
      return { ...state, message: { type: null, text: "" } };
    case "reset":
      return {
        ...state,
        SignUp: { userId: "", name: "", email: "", password: "" },
      };
    default:
      return state;
  }
};
function GlobalContext({ children }) {
  const [state, dispatch] = useReducer(reducer, intialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export default GlobalContext;
