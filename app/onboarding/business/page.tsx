'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const industries = [
  'E-commerce',
  'Healthcare',
  'Education',
  'Real Estate',
  'Manufacturing',
  'Technology',
  'Finance',
  'Retail',
  'Hospitality',
  'Professional Services',
  'Other',
];

const companySize = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees',
];

export default function BusinessProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    companyName: '',
    industry: '',
    size: '',
    website: '',
    primaryGoal: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save form data to local storage or state management
    localStorage.setItem('onboarding_business', JSON.stringify(formData));
    router.push('/onboarding/needs');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Tell us about your business</h1>
        <p className="text-muted-foreground">
          Help us understand your business better to provide tailored AI solutions
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            placeholder="Enter your company name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={formData.industry}
            onValueChange={(value) =>
              setFormData({ ...formData, industry: value })
            }
            required
          >
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry.toLowerCase()}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Company Size</Label>
          <Select
            value={formData.size}
            onValueChange={(value) => setFormData({ ...formData, size: value })}
            required
          >
            <SelectTrigger id="size">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {companySize.map((size) => (
                <SelectItem key={size} value={size.toLowerCase()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryGoal">Primary Business Goal</Label>
          <Input
            id="primaryGoal"
            value={formData.primaryGoal}
            onChange={(e) =>
              setFormData({ ...formData, primaryGoal: e.target.value })
            }
            placeholder="What's your main business objective?"
            required
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/onboarding')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button type="submit">
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  );
} 