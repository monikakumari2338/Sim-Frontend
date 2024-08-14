// Context for handling the item data temporarily

import React, { createContext, useContext, useState } from "react";

const ItemContext = createContext();

export const useItem = () => {
   return useContext(ItemContext);
};

export const ItemProvider = ({ children }) => {
   // States
   const [tempItems, setTempItems] = useState([]);
   const [tempReasons, setTempReasons] = useState([]);
   const [tempSupplier, setTempSupplier] = useState([]);

   // Functions
   function addItem(item) {
      setTempItems([...tempItems, item]);
   }
   function deleteItem(item) {
      setTempItems(tempItems.filter((i) => i !== item));
   }

   const contextVal = {
      tempItems,
      setTempItems,
      addItem,
      deleteItem,
   };

   return (
      <ItemContext.Provider value={contextVal}>{children}</ItemContext.Provider>
   );
};
