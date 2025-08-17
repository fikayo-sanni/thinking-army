'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useSetPageTitle } from '@/hooks/use-page-title';
import Link from 'next/link';

export default function NewAgentPage() {
  useSetPageTitle('New Agent');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/agents">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#202124] dark:text-[#E6E6E6]">
              New Agent
            </h1>
          </div>
        </div>
      </div>

      {/* New Agent Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#5F6368] dark:text-[#A0A0A0]">
            Choose an agent type to get started:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-start space-y-2"
              onClick={() => window.location.href = '/agents/new?type=small'}
            >
              <span className="text-lg font-semibold">Small Agent</span>
              <span className="text-sm text-[#5F6368] dark:text-[#A0A0A0] text-left">
                Entry-level AI workflows for specific business processes.
                Starting at €50/month.
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-start space-y-2"
              onClick={() => window.location.href = '/agents/new?type=big'}
            >
              <span className="text-lg font-semibold">Big Sales</span>
              <span className="text-sm text-[#5F6368] dark:text-[#A0A0A0] text-left">
                Enterprise-grade AI solution for comprehensive sales automation.
                Custom pricing.
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 