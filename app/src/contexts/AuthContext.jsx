import React, { createContext, useContext, useReducer } from "react";

/**
 * 
 * @author Patrick Shaw
 */
export const signInOutAction = "SIGN_INOUT";
export const setUserIdAction = "SET_USER_ID";
export const setGenderAction = "SET_GENDER";
export const setUserDataAction = "SET_USER_DATA";

const initialState = {
  signedIn: false,
  userId: null,
  gender: null,
  username: "",
  email: "",
  age: null,
  country: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case signInOutAction:
      return { ...state, signedIn: action.payload };
    case setUserIdAction:
      return { ...state, userId: action.payload };
    case setGenderAction:
      return { ...state, gender: action.payload };
    case setUserDataAction:
      const { username, email, age, country } = action.payload;
      return {
        ...state,
        username: username,
        email: email,
        age: age,
        country: country,
      };
    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const parseDataFromToken = (token) => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub;
      const genderID = payload.genderID;
      const gender = genderID === 1 ? "male" : genderID === 2 ? "female" : genderID === 3 ? "other" : null;
      return { userId, gender };
    }
    return { userId: null, gender: null };
  };

  const fetchUserData = (userId, token) => {
    fetch("https://w20012045.nuwebspace.co.uk/kv60032/api/userdata", {
      method: 'GET',
      headers: new Headers({
        "Authorization": "Bearer " + token
      }),
    })
      .then(response => {
        return response.status === 200 ? response.json() : {};
      })
      .then(data => {
        dispatch({ type: setUserDataAction, payload: data[0] });
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const signIn = (token) => {
    const { userId, gender } = parseDataFromToken(token);
    dispatch({ type: signInOutAction, payload: true });
    dispatch({ type: setUserIdAction, payload: userId });
    dispatch({ type: setGenderAction, payload: gender });
    fetchUserData(userId, token);
  };

  const signOut = () => {
    dispatch({ type: signInOutAction, payload: false });
    dispatch({ type: setUserIdAction, payload: null });
    dispatch({ type: setGenderAction, payload: null });
    dispatch({ type: setUserDataAction, payload: {} });
  };

  return (
    <AuthContext.Provider value={{ state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};