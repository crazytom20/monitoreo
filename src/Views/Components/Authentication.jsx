import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    // Verificar si el token ya existe en el localStorage
    const initialAuthState = localStorage.getItem('authToken') ? true : false;
  
    const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState);
  

  // Verificar el token en el localStorage cuando se monta el componente
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email, password) => {
    if (email === 'admin@gmail.com' && password === 'qwert') {
      localStorage.setItem('authToken', 'sampleToken');
      setIsAuthenticated(true);
      return true; 
    } 
    return false;
  }
  

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  }
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
