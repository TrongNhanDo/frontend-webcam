import React, { createContext, useState } from "react";
export const MainContext = createContext({
  role: 0,
  setRole: () => 0,
});

export function MainContextProvider({ children }) {
  const [role, setRole] = useState(0);

  return (
    <MainContext.Provider value={{ role, setRole }}>
      {children}
    </MainContext.Provider>
  );
}
