import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GridLoader } from 'react-spinners'
import styled from 'styled-components';

// interface User {
//   // Define the properties of your user object
//   id: string;
//   name: string;
//   // ...
// }


const Spinner = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`
interface AuthContextType {
  currentUser: any;
  login: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function login(user: any) {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }

  if (loading) {
    return <Spinner><GridLoader color='#9461fb' size={100} /></Spinner>; // Or replace with a loading spinner or similar
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


