'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Brain, Zap, ArrowRight } from 'lucide-react';

export default function OnboardingWelcomePage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome to Thinking Army</h1>
        <p className="text-lg text-muted-foreground">
          Let's get started with your AI transformation journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Small Agents</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Quick-start AI solutions for specific business processes.
            Perfect for automating individual tasks and workflows.
          </p>
          <div className="font-medium">Starting at:</div>
          <div className="text-2xl font-bold text-primary">€500</div>
          <div className="text-sm text-muted-foreground">+ €50/month Care Plan</div>
        </div>

        <div className="p-6 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Big Sales</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Enterprise-level AI transformation solutions.
            Complete systems for comprehensive business automation.
          </p>
          <div className="font-medium">Starting at:</div>
          <div className="text-2xl font-bold text-primary">€20,000</div>
          <div className="text-sm text-muted-foreground">Full solution</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">What to expect:</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span className="text-muted-foreground">
              Quick 5-minute questionnaire to understand your business needs
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span className="text-muted-foreground">
              Personalized AI agent recommendations based on your responses
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span className="text-muted-foreground">
              Demo results showing potential impact on your business
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span className="text-muted-foreground">
              Guided setup process with our Meta-Agent
            </span>
          </li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => router.push('/onboarding/business')}>
          Get Started
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
} 