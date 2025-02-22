import React, { createContext, useEffect, useState } from "react";

// initialize context
export const AuthContext = createContext();

// create provider
export default function AuthContextProvider({ children }) {
  // store all these user info in context
  const [contextIsLogin, setContextIsLogin] = useState(false);
  const [contextAvatar, setContextAvatar] = useState('');
  const [contextUserId, setContextUserId] = useState('');
  const [contextUsername, setContextUsername] = useState('');
  const [contextToken, setContextToken] = useState('');

  // when login, set the state, also save data to session storage
  const contextSetIsLogin = (data) => {
    setContextIsLogin(true);
    setContextAvatar(data.avatar);
    setContextUserId(data.user_id);
    setContextUsername(data.username);
    setContextToken(data.token);

    // save the data to localstorage
    sessionStorage.setItem('3900-token', data.token);
    sessionStorage.setItem('3900-avatar', data.avatar);
    sessionStorage.setItem('3900-userId', data.user_id);
    sessionStorage.setItem('3900-username', data.username);
  };

  // when logout, clear the session storage
  const contextSetIsLogout = () => {
    setContextIsLogin(false);
    setContextAvatar('');
    setContextUserId('');
    setContextUsername('');
    setContextToken('');

    // clear the session storage
    sessionStorage.clear();
  };

  // check if the user is login at the beginning
  useEffect(() => {
    const token = sessionStorage.getItem('3900-token');
    const avatar = sessionStorage.getItem('3900-avatar');
    const userId = sessionStorage.getItem('3900-userId');
    const username = sessionStorage.getItem('3900-username');

    if (token) {
      setContextIsLogin(true);
      setContextAvatar(avatar);
      setContextUserId(userId);
      setContextUsername(username);
      setContextToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        contextIsLogin,
        contextAvatar,
        contextUserId,
        contextUsername,
        contextToken,
        contextSetIsLogin,
        contextSetIsLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
