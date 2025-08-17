'use client';

import { useQuery } from '@tanstack/react-query';

interface NetworkUser {
  id: string;
  nickname: string;
  level: number;
  totalReferrals: number;
  isActive: boolean;
}

interface NetworkStructure {
  currentUser: NetworkUser;
  sponsor?: NetworkUser;
}

interface NetworkStats {
  activeMembers: number;
  totalDirectDownlines: number;
  totalActiveDownlines: number;
  totalDownlines: number;
}

// Mock data
const mockNetworkStructure: NetworkStructure = {
  currentUser: {
    id: '1',
    nickname: 'CurrentUser',
    level: 1,
    totalReferrals: 5,
    isActive: true,
  },
  sponsor: {
    id: '2',
    nickname: 'Sponsor',
    level: 0,
    totalReferrals: 15,
    isActive: true,
  },
};

const mockNetworkStats: NetworkStats = {
  activeMembers: 12,
  totalDirectDownlines: 15,
  totalActiveDownlines: 45,
  totalDownlines: 50,
};

const mockDirectDownlines: NetworkUser[] = [
  {
    id: '3',
    nickname: 'Member1',
    level: 1,
    totalReferrals: 3,
    isActive: true,
  },
  {
    id: '4',
    nickname: 'Member2',
    level: 1,
    totalReferrals: 2,
    isActive: true,
  },
  {
    id: '5',
    nickname: 'Member3',
    level: 1,
    totalReferrals: 0,
    isActive: false,
  },
];

export function useNetworkStructure() {
  return useQuery({
    queryKey: ['network', 'structure'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockNetworkStructure;
    },
  });
}

export function useNetworkStats(timeRange: string) {
  return useQuery({
    queryKey: ['network', 'stats', timeRange],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockNetworkStats;
    },
  });
}

export function useDirectDownlines(userId: string, level: number) {
  return useQuery({
    queryKey: ['network', 'downlines', userId, level],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockDirectDownlines;
    },
    enabled: !!userId, // Only run query if userId is provided
  });
} 