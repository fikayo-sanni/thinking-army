'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JourneyStage } from '@/components/crm/JourneyStage';
import { Pipeline } from '@/components/crm/Pipeline';
import { Plus, Trash2, Save, ArrowLeft, Settings } from 'lucide-react';
import { JourneyStage as JourneyStageType } from '@/lib/types/crm.types';

export default function JourneyBuilderPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [stages, setStages] = useState<JourneyStageType[]>([]);
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const handleAddStage = () => {
    const newStage: JourneyStageType = {
      id: `stage_${stages.length + 1}`,
      name: `Stage ${stages.length + 1}`,
      description: '',
      order: stages.length + 1,
      automationRules: [],
      requiredFields: [],
      nextStages: [],
    };
    setStages([...stages, newStage]);
    setActiveStage(newStage.id);
  };

  const handleUpdateStage = (updatedStage: JourneyStageType) => {
    setStages(stages.map((s) => (s.id === updatedStage.id ? updatedStage : s)));
  };

  const handleDeleteStage = (stageId: string) => {
    setStages(stages.filter((s) => s.id !== stageId));
    if (activeStage === stageId) {
      setActiveStage(null);
    }
  };

  const handleSave = () => {
    // TODO: Save journey template
    router.push('/crm/journeys');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/crm/journeys')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Journey Builder</h1>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Journey
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Journey Details */}
        <Card>
          <CardHeader>
            <CardTitle>Journey Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter journey name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter journey description"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stage Editor */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Stages</CardTitle>
            <Button onClick={handleAddStage}>
              <Plus className="mr-2 h-4 w-4" />
              Add Stage
            </Button>
          </CardHeader>
          <CardContent>
            {stages.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No stages yet</h3>
                <p className="text-muted-foreground">
                  Add stages to build your journey
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <Pipeline
                  journey={{
                    id: 'preview',
                    customerId: '',
                    name: name || 'New Journey',
                    description: description,
                    currentStage: activeStage || stages[0].id,
                    stageHistory: [],
                    status: 'active',
                    metrics: {
                      timeInStage: 0,
                      totalTime: 0,
                      completedTasks: 0,
                      totalTasks: stages.length,
                    },
                  }}
                  stages={stages}
                  onStageClick={setActiveStage}
                />

                {activeStage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Edit Stage</h3>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteStage(activeStage)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {stages
                      .filter((s) => s.id === activeStage)
                      .map((stage) => (
                        <div key={stage.id} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                              value={stage.name}
                              onChange={(e) =>
                                handleUpdateStage({
                                  ...stage,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Description
                            </label>
                            <Textarea
                              value={stage.description}
                              onChange={(e) =>
                                handleUpdateStage({
                                  ...stage,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Required Fields
                            </label>
                            <Select
                              value={stage.requiredFields[0] || ''}
                              onValueChange={(value) =>
                                handleUpdateStage({
                                  ...stage,
                                  requiredFields: [value],
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Add required field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="phone">Phone</SelectItem>
                                <SelectItem value="company">Company</SelectItem>
                                <SelectItem value="requirements">
                                  Requirements
                                </SelectItem>
                                <SelectItem value="budget">Budget</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Next Stages
                            </label>
                            <Select
                              value={stage.nextStages[0] || ''}
                              onValueChange={(value) =>
                                handleUpdateStage({
                                  ...stage,
                                  nextStages: [value],
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select next stage" />
                              </SelectTrigger>
                              <SelectContent>
                                {stages
                                  .filter((s) => s.id !== stage.id)
                                  .map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                      {s.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                  </motion.div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 