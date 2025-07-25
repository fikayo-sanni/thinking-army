"use client"

import React, { useState, useEffect } from 'react';
import { PageTitleContext } from '@/hooks/use-page-title';

interface PageTitleProviderProps {
  children: React.ReactNode;
  defaultTitle?: string;
}

export function PageTitleProvider({ children, defaultTitle = "Gamescoin" }: PageTitleProviderProps) {
  const [title, setTitle] = useState<string>(defaultTitle);

  useEffect(() => {
    // Update document title when title changes
    document.title = title;
  }, [title]);

  const updateTitle = (newTitle: string) => {
    // You can customize the title format here
    const formattedTitle = newTitle === defaultTitle ? defaultTitle : `${newTitle} | ${defaultTitle}`;
    setTitle(formattedTitle);
  };

  return (
    <PageTitleContext.Provider value={{ title, setTitle: updateTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
} 