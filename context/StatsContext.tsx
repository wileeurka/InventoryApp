import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from './AuthContext';

interface StatsContextType {
  articlesCount: number;
  scannedCount: number;
  refreshStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [articlesCount, setArticlesCount] = useState(0);
  const [scannedCount, setScannedCount] = useState(0);
  const { user } = useAuth();

  const refreshStats = async () => {
    if (!user) return;
    try {
      const res = await apiRequest('/stats');
      if (res.ok) {
        const data = await res.json();
        setArticlesCount(data.articlesCount);
        setScannedCount(data.scannedCount);
      }
    } catch (e) {
      console.error('refreshStats error', e);
    }
  };

  useEffect(() => {
    if (user) refreshStats();
  }, [user]);

  return (
    <StatsContext.Provider
      value={{ articlesCount, scannedCount, refreshStats }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) throw new Error('useStats must be used within a StatsProvider');
  return context;
};
