'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  AlertCircle,
  Clock,
  Mail,
  MessageSquare,
  Plus,
  Settings,
  Trash2,
  Zap,
} from 'lucide-react';
import { AutomationRule } from '@/lib/types/crm.types';

const triggerTypes = [
  {
    value: 'time',
    label: 'Time-based',
    description: 'Trigger based on time conditions',
    icon: Clock,
  },
  {
    value: 'event',
    label: 'Event-based',
    description: 'Trigger when specific events occur',
    icon: Zap,
  },
  {
    value: 'condition',
    label: 'Condition-based',
    description: 'Trigger when conditions are met',
    icon: AlertCircle,
  },
];

const actionTypes = [
  {
    value: 'email',
    label: 'Send Email',
    description: 'Send an automated email',
    icon: Mail,
  },
  {
    value: 'notification',
    label: 'Send Notification',
    description: 'Send an in-app notification',
    icon: MessageSquare,
  },
  {
    value: 'update',
    label: 'Update Record',
    description: 'Update customer or journey data',
    icon: Settings,
  },
];

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'rule_1',
      name: 'Welcome Email',
      description: 'Send welcome email when customer joins',
      trigger: {
        type: 'event',
        config: {
          event: 'customer.created',
        },
      },
      actions: [
        {
          type: 'email',
          config: {
            template: 'welcome_email',
            delay: 0,
          },
        },
      ],
      enabled: true,
    },
    {
      id: 'rule_2',
      name: 'Follow-up Reminder',
      description: 'Send reminder if no activity for 7 days',
      trigger: {
        type: 'time',
        config: {
          days: 7,
          condition: 'no_activity',
        },
      },
      actions: [
        {
          type: 'notification',
          config: {
            message: 'Customer needs follow-up',
            priority: 'high',
          },
        },
      ],
      enabled: true,
    },
  ]);

  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

  const handleAddRule = () => {
    const newRule: AutomationRule = {
      id: `rule_${rules.length + 1}`,
      name: 'New Rule',
      description: '',
      trigger: {
        type: 'event',
        config: {},
      },
      actions: [],
      enabled: false,
    };
    setRules([...rules, newRule]);
    setEditingRule(newRule);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((r) => r.id !== ruleId));
    if (editingRule?.id === ruleId) {
      setEditingRule(null);
    }
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(
      rules.map((r) =>
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      )
    );
  };

  const handleUpdateRule = (updatedRule: AutomationRule) => {
    setRules(
      rules.map((r) => (r.id === updatedRule.id ? updatedRule : r))
    );
    setEditingRule(updatedRule);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automation Rules</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage automated workflows
          </p>
        </div>
        <Button onClick={handleAddRule}>
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Rules List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rules.map((rule) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg border p-4 transition-colors ${
                    editingRule?.id === rule.id
                      ? 'border-primary ring-1 ring-primary/20'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setEditingRule(rule)}
                    >
                      <h3 className="font-medium">{rule.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {rule.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rule Editor */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingRule ? 'Edit Rule' : 'Select a Rule'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingRule ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editingRule.name}
                    onChange={(e) =>
                      handleUpdateRule({
                        ...editingRule,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editingRule.description}
                    onChange={(e) =>
                      handleUpdateRule({
                        ...editingRule,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trigger Type</label>
                  <Select
                    value={editingRule.trigger.type}
                    onValueChange={(value) =>
                      handleUpdateRule({
                        ...editingRule,
                        trigger: {
                          type: value as 'time' | 'event' | 'condition',
                          config: {},
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger type" />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{type.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {type.description}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Actions</label>
                  <div className="space-y-2">
                    {editingRule.actions.map((action, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg border p-2"
                      >
                        <div className="flex-1">
                          <p className="font-medium capitalize">
                            {action.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {JSON.stringify(action.config)}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            handleUpdateRule({
                              ...editingRule,
                              actions: editingRule.actions.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Select
                      onValueChange={(value) =>
                        handleUpdateRule({
                          ...editingRule,
                          actions: [
                            ...editingRule.actions,
                            { type: value, config: {} },
                          ],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add action" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              <div>
                                <p className="font-medium">{type.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  No rule selected
                </h3>
                <p className="text-muted-foreground">
                  Select a rule to edit or create a new one
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 