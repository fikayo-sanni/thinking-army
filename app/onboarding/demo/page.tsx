'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Brain, Zap, Clock, TrendingUp } from 'lucide-react';

export default function DemoResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Load saved data from previous steps
  const businessData = React.useMemo(() => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('onboarding_business');
    return data ? JSON.parse(data) : null;
  }, []);

  const selectedProcesses = React.useMemo(() => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('onboarding_needs');
    return data ? JSON.parse(data) : [];
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Analyzing Your Business Needs</h1>
          <p className="text-muted-foreground">
            Our Meta-Agent is preparing your personalized AI recommendations
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">
            {progress}% complete
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Your AI Transformation Plan</h1>
        <p className="text-muted-foreground">
          Based on your business profile and needs, here's our recommended approach
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Small Agents */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>Recommended Small Agents</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProcesses.slice(0, 3).map((process) => (
              <div key={process} className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{process}</div>
                  <div className="text-sm text-muted-foreground">
                    €500 + €50/month
                  </div>
                </div>
                <Badge variant="outline">Ready to Deploy</Badge>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">Estimated Impact:</div>
                <div className="font-medium">
                  20-30 hours saved per month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Big Sales Recommendation */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Enterprise Solution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="font-medium">Complete Business Automation</div>
              <div className="text-sm text-muted-foreground">
                Integrates all selected processes into a comprehensive system
              </div>
              <div className="text-2xl font-bold text-primary">€20,000</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Key Benefits:</div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span>100+ hours saved monthly</span>
                </div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                  <span>30% efficiency increase</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Next Steps</h2>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <div className="font-medium">Start with Small Agents</div>
              <div className="text-sm text-muted-foreground">
                Begin with specific processes to see immediate results
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <div className="font-medium">Measure Impact</div>
              <div className="text-sm text-muted-foreground">
                Track performance improvements and ROI
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <div className="font-medium">Scale Up</div>
              <div className="text-sm text-muted-foreground">
                Upgrade to the enterprise solution when ready
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push('/onboarding/needs')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={() => router.push('/onboarding/complete')}>
          Complete Setup
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
} 