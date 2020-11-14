import { createContext, useReducer, FunctionComponent } from "react";
import { User } from "../lib/types";

interface State {
  user: User;
}

type ActionType = "SET_USER";

interface Action {
  type: ActionType;
  payload: any;
}

export const UserContext = createContext({});

const initialState = {
  user: null,
};

const userReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
  }
};

export const UserProvider: FunctionComponent<{}> = ({ children }) => {
  const [userState, userDispatch] = useReducer(userReducer, initialState);

  const { user } = userState;

  const setUser = (payload: any) => userDispatch({ type: "SET_USER", payload });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
