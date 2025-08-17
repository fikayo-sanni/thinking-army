import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, MoveUp, MoveDown, Play, Save } from 'lucide-react';

interface WorkflowAction {
  id: string;
  type: string;
  name: string;
  parameters: Record<string, any>;
}

interface WorkflowTrigger {
  type: 'manual' | 'scheduled' | 'event';
  configuration: Record<string, any>;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
}

interface WorkflowBuilderProps {
  workflow?: Workflow;
  onSave: (workflow: Workflow) => void;
  onTest?: (workflow: Workflow) => void;
}

const actionTypes = [
  'generate_content',
  'send_email',
  'update_crm',
  'create_task',
  'analyze_data',
];

const triggerTypes = [
  { value: 'manual', label: 'Manual Trigger' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'event', label: 'Event-based' },
];

export function WorkflowBuilder({ workflow: initialWorkflow, onSave, onTest }: WorkflowBuilderProps) {
  const [workflow, setWorkflow] = React.useState<Workflow>(
    initialWorkflow || {
      id: `wf-${Date.now()}`,
      name: '',
      description: '',
      trigger: {
        type: 'manual',
        configuration: {},
      },
      actions: [],
    }
  );

  const addAction = () => {
    setWorkflow({
      ...workflow,
      actions: [
        ...workflow.actions,
        {
          id: `action-${Date.now()}`,
          type: actionTypes[0],
          name: '',
          parameters: {},
        },
      ],
    });
  };

  const removeAction = (index: number) => {
    const newActions = [...workflow.actions];
    newActions.splice(index, 1);
    setWorkflow({ ...workflow, actions: newActions });
  };

  const moveAction = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === workflow.actions.length - 1)
    ) {
      return;
    }

    const newActions = [...workflow.actions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newActions[index], newActions[newIndex]] = [newActions[newIndex], newActions[index]];
    setWorkflow({ ...workflow, actions: newActions });
  };

  const updateAction = (index: number, updates: Partial<WorkflowAction>) => {
    const newActions = [...workflow.actions];
    newActions[index] = { ...newActions[index], ...updates };
    setWorkflow({ ...workflow, actions: newActions });
  };

  const handleSave = () => {
    onSave(workflow);
  };

  const handleTest = () => {
    onTest?.(workflow);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Workflow Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Workflow Name</Label>
            <Input
              value={workflow.name}
              onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
              placeholder="Enter workflow name"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={workflow.description}
              onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
              placeholder="Describe what this workflow does"
            />
          </div>
        </div>

        {/* Trigger Configuration */}
        <div className="space-y-4">
          <Label>Trigger</Label>
          <Select
            value={workflow.trigger.type}
            onValueChange={(value: 'manual' | 'scheduled' | 'event') =>
              setWorkflow({
                ...workflow,
                trigger: { type: value, configuration: {} },
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select trigger type" />
            </SelectTrigger>
            <SelectContent>
              {triggerTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {workflow.trigger.type === 'scheduled' && (
            <div className="space-y-2">
              <Label>Schedule (Cron Expression)</Label>
              <Input
                value={workflow.trigger.configuration.schedule || ''}
                onChange={(e) =>
                  setWorkflow({
                    ...workflow,
                    trigger: {
                      ...workflow.trigger,
                      configuration: { schedule: e.target.value },
                    },
                  })
                }
                placeholder="0 9 * * 1-5"
              />
            </div>
          )}

          {workflow.trigger.type === 'event' && (
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Input
                value={workflow.trigger.configuration.eventType || ''}
                onChange={(e) =>
                  setWorkflow({
                    ...workflow,
                    trigger: {
                      ...workflow.trigger,
                      configuration: { eventType: e.target.value },
                    },
                  })
                }
                placeholder="e.g., new_customer"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Actions</Label>
            <Button variant="outline" size="sm" onClick={addAction}>
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </div>

          {workflow.actions.map((action, index) => (
            <Card key={action.id} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Action {index + 1}</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveAction(index, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveAction(index, 'down')}
                      disabled={index === workflow.actions.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAction(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={action.type}
                    onValueChange={(value) => updateAction(index, { type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={action.name}
                    onChange={(e) => updateAction(index, { name: e.target.value })}
                    placeholder="Action name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Parameters</Label>
                  <Input
                    value={JSON.stringify(action.parameters)}
                    onChange={(e) => {
                      try {
                        const parameters = JSON.parse(e.target.value);
                        updateAction(index, { parameters });
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder="Parameters (JSON)"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          {onTest && (
            <Button variant="outline" onClick={handleTest}>
              <Play className="h-4 w-4 mr-2" />
              Test Workflow
            </Button>
          )}
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Workflow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 