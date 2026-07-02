import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password, role) => {
    // Simulación de login
    const fakeUser = {
      id: 1,
      username,
      role: parseInt(role),
      name: username === 'admin' ? 'Administrador' : 'Cliente Demo'
    };
    setUser(fakeUser);
    localStorage.setItem('user', JSON.stringify(fakeUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};