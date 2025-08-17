import React from 'react';
import { Agent, SmallAgent, BigAgent } from '@/lib/types/agent.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, Plus, Minus } from 'lucide-react';

interface AgentConfigProps {
  agent: Agent;
  onSave: (config: any) => void;
  onCancel: () => void;
}

export function AgentConfig({ agent, onSave, onCancel }: AgentConfigProps) {
  const isSmallAgent = agent.type === 'small';
  const [config, setConfig] = React.useState(
    isSmallAgent
      ? (agent as SmallAgent).configuration
      : {
          customizations: (agent as BigAgent).customizations,
          integrations: (agent as BigAgent).integrations,
          workflows: (agent as BigAgent).workflows,
        }
  );

  const handleSave = () => {
    onSave(config);
  };

  const renderSmallAgentConfig = () => {
    const smallAgent = agent as SmallAgent;
    return (
      <>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Process Parameters</Label>
            {Object.entries(smallAgent.configuration.processParameters).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Input
                  value={config.processParameters[key]}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      processParameters: {
                        ...config.processParameters,
                        [key]: e.target.value,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Integrations</Label>
            {config.integrations.map((integration, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={integration}
                  onChange={(e) => {
                    const newIntegrations = [...config.integrations];
                    newIntegrations[index] = e.target.value;
                    setConfig({ ...config, integrations: newIntegrations });
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newIntegrations = config.integrations.filter((_, i) => i !== index);
                    setConfig({ ...config, integrations: newIntegrations });
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setConfig({
                  ...config,
                  integrations: [...config.integrations, ''],
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Schedule</Label>
            <Input
              value={config.schedule || ''}
              placeholder="Cron expression (e.g., 0 9 * * 1-5)"
              onChange={(e) =>
                setConfig({ ...config, schedule: e.target.value })
              }
            />
          </div>
        </div>
      </>
    );
  };

  const renderBigAgentConfig = () => {
    const bigAgent = agent as BigAgent;
    return (
      <>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Customizations</Label>
            {config.customizations.map((customization, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-2">
                  <Input
                    value={customization.name}
                    placeholder="Name"
                    onChange={(e) => {
                      const newCustomizations = [...config.customizations];
                      newCustomizations[index] = {
                        ...customization,
                        name: e.target.value,
                      };
                      setConfig({ ...config, customizations: newCustomizations });
                    }}
                  />
                  <Input
                    value={customization.description}
                    placeholder="Description"
                    onChange={(e) => {
                      const newCustomizations = [...config.customizations];
                      newCustomizations[index] = {
                        ...customization,
                        description: e.target.value,
                      };
                      setConfig({ ...config, customizations: newCustomizations });
                    }}
                  />
                  <Input
                    type="number"
                    value={customization.price}
                    placeholder="Price"
                    onChange={(e) => {
                      const newCustomizations = [...config.customizations];
                      newCustomizations[index] = {
                        ...customization,
                        price: Number(e.target.value),
                      };
                      setConfig({ ...config, customizations: newCustomizations });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newCustomizations = config.customizations.filter(
                        (_, i) => i !== index
                      );
                      setConfig({ ...config, customizations: newCustomizations });
                    }}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setConfig({
                  ...config,
                  customizations: [
                    ...config.customizations,
                    { name: '', description: '', price: 0 },
                  ],
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Customization
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Integrations</Label>
            {config.integrations.map((integration, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={integration.name}
                  onChange={(e) => {
                    const newIntegrations = [...config.integrations];
                    newIntegrations[index] = {
                      ...integration,
                      name: e.target.value,
                    };
                    setConfig({ ...config, integrations: newIntegrations });
                  }}
                />
                <Select
                  value={integration.status}
                  onValueChange={(value) => {
                    const newIntegrations = [...config.integrations];
                    newIntegrations[index] = {
                      ...integration,
                      status: value as 'active' | 'pending' | 'failed',
                    };
                    setConfig({ ...config, integrations: newIntegrations });
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newIntegrations = config.integrations.filter(
                      (_, i) => i !== index
                    );
                    setConfig({ ...config, integrations: newIntegrations });
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setConfig({
                  ...config,
                  integrations: [
                    ...config.integrations,
                    { name: '', status: 'pending' },
                  ],
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Workflows</Label>
            {config.workflows.map((workflow, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={workflow.name}
                  onChange={(e) => {
                    const newWorkflows = [...config.workflows];
                    newWorkflows[index] = {
                      ...workflow,
                      name: e.target.value,
                    };
                    setConfig({ ...config, workflows: newWorkflows });
                  }}
                />
                <Select
                  value={workflow.status}
                  onValueChange={(value) => {
                    const newWorkflows = [...config.workflows];
                    newWorkflows[index] = {
                      ...workflow,
                      status: value as 'active' | 'inactive' | 'error',
                    };
                    setConfig({ ...config, workflows: newWorkflows });
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newWorkflows = config.workflows.filter(
                      (_, i) => i !== index
                    );
                    setConfig({ ...config, workflows: newWorkflows });
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setConfig({
                  ...config,
                  workflows: [
                    ...config.workflows,
                    {
                      id: `wf-${Date.now()}`,
                      name: '',
                      status: 'inactive',
                    },
                  ],
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Workflow
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Configure {agent.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSmallAgent ? renderSmallAgentConfig() : renderBigAgentConfig()}
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 