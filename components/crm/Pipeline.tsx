import { CustomerJourney, JourneyStage } from '@/lib/types/crm.types';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ChevronRight } from 'lucide-react';
import { JourneyStage as JourneyStageComponent } from './JourneyStage';

interface PipelineProps {
  journey: CustomerJourney;
  stages: JourneyStage[];
  onStageClick?: (stageId: string) => void;
  className?: string;
}

export function Pipeline({
  journey,
  stages,
  onStageClick,
  className,
}: PipelineProps) {
  // Sort stages by order
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  // Find completed stages from history
  const completedStages = new Set(
    journey.stageHistory
      .filter((history) => history.completedAt)
      .map((history) => history.stageId)
  );

  return (
    <Card className={className}>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {sortedStages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <JourneyStageComponent
                stage={stage}
                isActive={journey.currentStage === stage.id}
                isCompleted={completedStages.has(stage.id)}
                onStageClick={onStageClick}
                className="w-[300px]"
              />
              {index < sortedStages.length - 1 && (
                <ChevronRight className="mx-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
} 