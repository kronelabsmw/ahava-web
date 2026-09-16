"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type StoreNavContextValue = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  openMenu: () => void;
  openMenuWithSearch: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  openCart: () => void;
};

const StoreNavContext = createContext<StoreNavContextValue | null>(null);

export function StoreNavProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const openMenu = useCallback(() => setMenuOpen(true), []);

  const openMenuWithSearch = useCallback(() => {
    setMenuOpen(true);
    requestAnimationFrame(() => searchInputRef.current?.focus());
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);

  return (
    <StoreNavContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
        openMenu,
        openMenuWithSearch,
        searchInputRef,
        cartOpen,
        setCartOpen,
        openCart,
      }}
    >
      {children}
    </StoreNavContext.Provider>
  );
}

export function useStoreNav() {
  const context = useContext(StoreNavContext);
  if (!context) {
    throw new Error("useStoreNav must be used within StoreNavProvider");
  }
  return context;
}
