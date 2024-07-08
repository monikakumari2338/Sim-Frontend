import { useState } from "react";
import React, { createContext, useEffect, useContext } from "react";
import axios from "axios";

export const ApiContext = createContext();
export const ApiContextProvider = ({ children }) => {
  const [rtvData, setRtvData] = useState(null);
  return (
    <ApiContext.Provider value={{ rtvData, setRtvData }}>
      {children}
    </ApiContext.Provider>
  );
};
