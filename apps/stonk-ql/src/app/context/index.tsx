import React, { createContext, useContext, useState } from 'react';

export interface ContextModel {
  isLoggedIn: boolean;
}

export const DEFAULT_STATE: ContextModel = {
  isLoggedIn: false,
};

type ContextType = {
  context: ContextModel;
  updateContext: (updateData: Partial<ContextModel>) => void;
};

export const Context = createContext<ContextType>({
  context: DEFAULT_STATE,
  updateContext: () => null,
});

export const useCtx = () => useContext(Context);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [context, setContext] = useState<ContextModel>(DEFAULT_STATE);

  function updateContext(updateData: Partial<ContextModel>) {
    setContext((context) => {
      return { ...context, ...updateData };
    });
  }

  return (
    <Context.Provider value={{ context, updateContext }}>
      {children}
    </Context.Provider>
  );
};
