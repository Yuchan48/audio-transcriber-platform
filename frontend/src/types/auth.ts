import type { User } from "./user";

export type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  loading: boolean;

  skipAuthCheck: boolean;
  setSkipAuthCheck: React.Dispatch<React.SetStateAction<boolean>>;

  loadUser: () => Promise<boolean>;
};
