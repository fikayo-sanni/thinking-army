'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NetworkUser {
  id: string;
  nickname: string;
  level: number;
  directReferrals: number;
  isActive: boolean;
  avatar?: string;
  rank?: string;
}

interface NetworkNodeProps {
  user: NetworkUser;
  sponsor?: NetworkUser;
  totalReferrals: number;
  direction?: 'up' | 'down';
  isExpanded?: boolean;
}

export function NetworkNode({ user, sponsor, totalReferrals, direction = 'down', isExpanded = false }: NetworkNodeProps) {
  const [expanded, setExpanded] = useState(isExpanded);

  // Mock children data
  const mockChildren = [
    {
      id: '101',
      nickname: 'Alice Smith',
      level: user.level + 1,
      directReferrals: 8,
      isActive: true,
      rank: 'Gold',
      children: [
        {
          id: '201',
          nickname: 'Bob Johnson',
          level: user.level + 2,
          directReferrals: 3,
          isActive: true,
          rank: 'Silver'
        },
        {
          id: '202',
          nickname: 'Carol White',
          level: user.level + 2,
          directReferrals: 2,
          isActive: true,
          rank: 'Bronze'
        }
      ]
    },
    {
      id: '102',
      nickname: 'David Brown',
      level: user.level + 1,
      directReferrals: 5,
      isActive: true,
      rank: 'Silver',
      children: [
        {
          id: '203',
          nickname: 'Eve Wilson',
          level: user.level + 2,
          directReferrals: 1,
          isActive: false,
          rank: 'Bronze'
        }
      ]
    },
    {
      id: '103',
      nickname: 'Frank Davis',
      level: user.level + 1,
      directReferrals: 0,
      isActive: false,
      rank: 'Bronze'
    }
  ];

  return (
    <div className="w-full">
      {/* Node Container */}
      <div className="flex items-center gap-4 p-4 rounded-lg border border-[#E4E6EB] dark:border-[#2A2A2A] bg-white  shadow-sm">
        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-[#297EFF]/10 dark:bg-[#4D8DFF]/10 flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.nickname} className="h-full w-full rounded-full" />
            ) : (
              <User className="h-5 w-5 text-[#297EFF] dark:text-[#4D8DFF]" />
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#202124] dark:text-[#E6E6E6]">
              {user.nickname}
            </span>
            {user.rank && (
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                user.rank === 'Gold' && "bg-yellow-500/10 text-yellow-500",
                user.rank === 'Silver' && "bg-gray-500/10 text-gray-500",
                user.rank === 'Bronze' && "bg-orange-500/10 text-orange-500"
              )}>
                {user.rank}
              </span>
            )}
            {!user.isActive && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
                Inactive
              </span>
            )}
          </div>
          <div className="text-sm text-[#5F6368] dark:text-[#A0A0A0] mt-1">
            {user.directReferrals} Direct • Level {user.level}
          </div>
        </div>

        {/* Total Referrals */}
        <div className="flex-shrink-0 text-right">
          <div className="text-sm text-[#5F6368] dark:text-[#A0A0A0]">Total Network</div>
          <div className="font-medium text-[#202124] dark:text-[#E6E6E6]">{totalReferrals}</div>
        </div>
      </div>

      {/* Children */}
      {expanded && (
        <div className="ml-8 mt-4 space-y-4 border-l-2 border-dashed border-[#E4E6EB] dark:border-[#2A2A2A] pl-8">
          {mockChildren.map((child) => (
            <NetworkNode
              key={child.id}
              user={child}
              totalReferrals={child.directReferrals + (child.children?.length || 0)}
              direction={direction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
