import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [solutions, setSolutions] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getSolutions(),
      api.getIndustries(),
      api.getStacks(),
      api.getFeatured(),
      api.getCollections(),
    ])
      .then(([sols, inds, stks, feat, cols]) => {
        setSolutions(sols);
        setIndustries(inds);
        setStacks(stks);
        setFeatured(feat);
        setCollections(cols);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DataContext.Provider value={{ solutions, industries, stacks, featured, collections, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
