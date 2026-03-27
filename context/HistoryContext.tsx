import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { apiRequest } from '../services/api';

export interface HistoryItem {
  id: string;
  quantity: number;
  scannedAt: string;
  notes?: string;
  product: {
    id: string;
    name: string;
    code: string;
    flavor?: string;
    description?: string;
  };
  name: string;
  code: string;
  extra: string;
  date: Date;
}

interface HistoryContextType {
  historyItems: HistoryItem[];
  loading: boolean;
  fetchHistory: (sortBy?: 'newest' | 'oldest', month?: string) => Promise<void>;
  addToHistory: (productId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (id: string, quantity: number) => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const mapItem = (raw: any): HistoryItem => ({
  ...raw,
  date: new Date(raw.scannedAt),
  name: raw.product?.name || '',
  code: raw.product?.code ? `Kod: ${raw.product.code}` : '',
  extra: raw.product?.flavor ? `Smak: ${raw.product.flavor}` : '',
});

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(
    async (sortBy: 'newest' | 'oldest' = 'newest', month?: string) => {
      setLoading(true);
      try {
        let url = `/history?sortBy=${sortBy}`;
        if (month) url += `&month=${month}`;
        const res = await apiRequest(url);
        if (res.ok) {
          const data = await res.json();
          setHistoryItems(data.map(mapItem));
        }
      } catch (e) {
        console.error('fetchHistory error', e);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const addToHistory = async (productId: string, quantity: number) => {
    const res = await apiRequest('/history', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    if (res.ok) {
      const raw = await res.json();
      setHistoryItems((prev) => [mapItem(raw), ...prev]);
    }
  };

  const updateItemQuantity = async (id: string, quantity: number) => {
    const res = await apiRequest(`/history/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      setHistoryItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    }
  };

  return (
    <HistoryContext.Provider
      value={{ historyItems, loading, fetchHistory, addToHistory, updateItemQuantity }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within HistoryProvider');
  return context;
};
