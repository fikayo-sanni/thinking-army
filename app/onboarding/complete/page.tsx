'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function OnboardingCompletePage() {
  const router = useRouter();

  return (
    <div className="space-y-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Setup Complete!</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          You're all set to start your AI transformation journey with Thinking Army
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card className="p-6 text-left">
          <h2 className="text-lg font-semibold mb-2">What's Next?</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Review your recommended AI agents
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Configure your first agent
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Start seeing results within days
            </li>
          </ul>
        </Card>

        <Card className="p-6 text-left">
          <h2 className="text-lg font-semibold mb-2">Support</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              24/7 technical assistance
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Dedicated onboarding specialist
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Regular check-ins and optimization
            </li>
          </ul>
        </Card>
      </div>

      <div className="pt-4">
        <Button
          size="lg"
          onClick={() => router.push('/dashboard')}
          className="min-w-[200px]"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
} 