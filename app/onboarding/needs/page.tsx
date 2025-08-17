'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const businessProcesses = [
  {
    category: 'Sales & Marketing',
    processes: [
      'Lead generation and qualification',
      'Email marketing automation',
      'Social media content creation',
      'Customer segmentation',
      'Sales pipeline management',
    ],
  },
  {
    category: 'Customer Service',
    processes: [
      'Customer inquiry handling',
      'Support ticket classification',
      'FAQ automation',
      'Customer feedback analysis',
      'Service quality monitoring',
    ],
  },
  {
    category: 'Operations',
    processes: [
      'Inventory management',
      'Supply chain optimization',
      'Quality control',
      'Resource scheduling',
      'Process automation',
    ],
  },
  {
    category: 'Finance & Admin',
    processes: [
      'Invoice processing',
      'Expense management',
      'Financial reporting',
      'Compliance monitoring',
      'Document management',
    ],
  },
];

export default function NeedsAssessmentPage() {
  const router = useRouter();
  const [selectedProcesses, setSelectedProcesses] = React.useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save selected processes to local storage or state management
    localStorage.setItem('onboarding_needs', JSON.stringify(selectedProcesses));
    router.push('/onboarding/demo');
  };

  const toggleProcess = (process: string) => {
    setSelectedProcesses((current) =>
      current.includes(process)
        ? current.filter((p) => p !== process)
        : [...current, process]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Select Your AI Needs</h1>
        <p className="text-muted-foreground">
          Choose the business processes you'd like to enhance with AI
        </p>
      </div>

      <div className="space-y-6">
        {businessProcesses.map((category) => (
          <Card key={category.category} className="p-6">
            <h2 className="text-lg font-semibold mb-4">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.processes.map((process) => (
                <div key={process} className="flex items-start space-x-3">
                  <Checkbox
                    id={process}
                    checked={selectedProcesses.includes(process)}
                    onCheckedChange={() => toggleProcess(process)}
                  />
                  <Label
                    htmlFor={process}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {process}
                  </Label>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/onboarding/business')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={selectedProcesses.length === 0}
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  );
} 