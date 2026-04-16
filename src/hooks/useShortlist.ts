import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@scoutiq_shortlist';

type ShortlistContextType = {
  shortlist: string[];
  addToShortlist: (id: string) => void;
  removeFromShortlist: (id: string) => void;
  isShortlisted: (id: string) => boolean;
  toggleShortlist: (id: string) => void;
};

const defaultContext: ShortlistContextType = {
  shortlist: [],
  addToShortlist: () => {},
  removeFromShortlist: () => {},
  isShortlisted: () => false,
  toggleShortlist: () => {},
};

export const ShortlistContext = createContext<ShortlistContextType>(defaultContext);

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const [shortlist, setShortlist] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value) {
        try {
          setShortlist(JSON.parse(value));
        } catch {
          // ignore corrupt storage data
        }
      }
    });
  }, []);

  const persist = (ids: string[]) => {
    setShortlist(ids);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  };

  const addToShortlist = (id: string) => {
    if (!shortlist.includes(id)) persist([...shortlist, id]);
  };

  const removeFromShortlist = (id: string) => {
    persist(shortlist.filter(i => i !== id));
  };

  const isShortlisted = (id: string) => shortlist.includes(id);

  const toggleShortlist = (id: string) => {
    isShortlisted(id) ? removeFromShortlist(id) : addToShortlist(id);
  };

  // Using React.createElement to keep this a .ts file (no JSX extension needed)
  return React.createElement(
    ShortlistContext.Provider,
    { value: { shortlist, addToShortlist, removeFromShortlist, isShortlisted, toggleShortlist } },
    children,
  );
}

export function useShortlist(): ShortlistContextType {
  return useContext(ShortlistContext);
}
