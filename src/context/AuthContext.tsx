import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
// utils
import { useNavigate } from "react-router-dom";
import axiosInstance, { setSession } from "../utils/session";
//

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

interface User {
  roles: { name: string }[];
  // Add other user properties here
}

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthAction {
  type: "INITIAL" | "LOGIN" | "REGISTER" | "LOGOUT";
  payload?: {
    isAuthenticated?: boolean;
    user?: User;
  };
}

const initialState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "INITIAL":
      return {
        isInitialized: true,
        isAuthenticated: action.payload?.isAuthenticated || false,
        user: action.payload?.user || null,
      };
    case "LOGIN":
    case "REGISTER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload?.user || null,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<AuthState | any>(initialState);

// ----------------------------------------------------------------------

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();
  //   const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser) {
        setSession(parsedUser?.accessToken);
        const response = await axiosInstance.get(`user/${parsedUser.id}`);
        if (response.data.role === "admin") {
          navigate("/admin");
        }
        if (response.data.role === "staff") {
          navigate("/staff");
        }
        if (response.data.role === "player") {
          navigate("/player");
        }
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const response = await axiosInstance.post("player", {
      email,
      password,
    });

    const { accessToken } = response.data;
    if (response.data) {
      setSession(accessToken);
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch({
        type: "LOGIN",
        payload: {
          user: response.data,
        },
      });
    } else {
      dispatch({
        type: "INITIAL",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, []);

  const [player, setPlayer] = useState([]);
  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: "jwt",
      login,
      setPlayer,
      player,
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.user,
      login,
      setPlayer,
      player,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
