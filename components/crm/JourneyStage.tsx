import { JourneyStage as JourneyStageType } from '@/lib/types/crm.types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JourneyStageProps {
  stage: JourneyStageType;
  isActive?: boolean;
  isCompleted?: boolean;
  onStageClick?: (stageId: string) => void;
  className?: string;
}

export function JourneyStage({
  stage,
  isActive = false,
  isCompleted = false,
  onStageClick,
  className,
}: JourneyStageProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200',
        isActive && 'border-primary ring-1 ring-primary/20',
        isCompleted && 'border-green-500/50',
        !isActive && !isCompleted && 'opacity-70',
        onStageClick && 'cursor-pointer hover:border-primary/50',
        className
      )}
      onClick={() => onStageClick?.(stage.id)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : isActive ? (
              <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
            )}
            {!isCompleted && stage.requiredFields.length > 0 && (
              <AlertCircle className="absolute -right-1 -top-1 h-3 w-3 text-yellow-500" />
            )}
          </div>
          <h3 className="font-semibold">{stage.name}</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          Stage {stage.order}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {stage.description}
        </p>
        {stage.requiredFields.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Required Fields:
            </p>
            <div className="flex flex-wrap gap-1">
              {stage.requiredFields.map((field) => (
                <Badge
                  key={field}
                  variant="secondary"
                  className="text-xs capitalize"
                >
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {stage.automationRules.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Automation Rules:
            </p>
            <div className="space-y-1">
              {stage.automationRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground">{rule.name}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      rule.enabled ? 'text-green-500' : 'text-muted-foreground'
                    )}
                  >
                    {rule.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
        {stage.nextStages.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                Next Stages:
              </p>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 