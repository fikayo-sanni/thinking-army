import { createContext, useContext, useEffect } from 'react';

interface PageTitleContextType {
  title: string;
  setTitle: (title: string) => void;
}

export const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);

export function usePageTitle() {
  const context = useContext(PageTitleContext);
  if (!context) {
    throw new Error('usePageTitle must be used within a PageTitleProvider');
  }
  return context;
}

// Helper hook to set page title automatically
export function useSetPageTitle(title: string) {
  const { setTitle } = usePageTitle();
  
  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
} 