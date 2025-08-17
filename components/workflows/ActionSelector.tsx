import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus } from 'lucide-react';

interface ActionTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
    default?: any;
  }[];
}

interface ActionSelectorProps {
  templates: ActionTemplate[];
  onSelect: (template: ActionTemplate) => void;
  className?: string;
}

export function ActionSelector({ templates, onSelect, className = '' }: ActionSelectorProps) {
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(templates.map((t) => t.category));
    return Array.from(uniqueCategories);
  }, [templates]);

  const filteredTemplates = React.useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        search === '' ||
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = !selectedCategory || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [templates, search, selectedCategory]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Select Action</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search actions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="p-4 cursor-pointer hover:bg-accent"
                  onClick={() => onSelect(template)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {template.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {template.parameters.length} parameter
                        {template.parameters.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
} 