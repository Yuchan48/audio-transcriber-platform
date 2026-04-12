import { createContext, useContext, useState } from "react";

// import functions
import { fetchCurrentUser } from "../services/userService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skipAuthCheck, setSkipAuthCheck] = useState(false);

  // fetch current user on mount
  const loadUser = async () => {
    setLoading(true);
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      return true;
    } catch (error) {
      console.error("[AuthContext] Failed to fetch current user:", error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loadUser,
        loading,
        skipAuthCheck,
        setSkipAuthCheck,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
