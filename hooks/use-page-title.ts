'use client';

import { useEffect } from 'react';
import { usePageTitle as usePageTitleContext } from '@/components/providers/page-title-provider';

export function useSetPageTitle(title: string) {
  const { setTitle } = usePageTitleContext();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
} 