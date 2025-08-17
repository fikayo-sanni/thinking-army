'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const steps = [
  { path: '/onboarding', label: 'Welcome' },
  { path: '/onboarding/business', label: 'Business Profile' },
  { path: '/onboarding/needs', label: 'AI Needs' },
  { path: '/onboarding/demo', label: 'Demo Results' },
  { path: '/onboarding/complete', label: 'Complete' },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="min-h-screen bg-muted/5">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <React.Fragment key={step.path}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                        index <= currentStepIndex
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {index + 1}
                    </div>
                    <div
                      className={cn(
                        'text-xs mt-2 text-center',
                        index <= currentStepIndex
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-2',
                        index < currentStepIndex
                          ? 'bg-primary'
                          : 'bg-muted'
                      )}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content */}
          {children}
        </Card>
      </div>
    </div>
  );
} 