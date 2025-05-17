import React, { createContext, useState } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user state

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

