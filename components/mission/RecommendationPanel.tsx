import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, CheckCircle, Zap } from 'lucide-react';

interface Recommendation {
  title: string;
  description: string;
  benefits: string[];
  upgradePath: {
    name: string;
    description: string;
    price: number;
  };
  priority: 'high' | 'medium' | 'low';
}

interface RecommendationPanelProps {
  recommendations: Recommendation[];
  onUpgrade: (upgradePath: string) => void;
  className?: string;
}

const priorityColors = {
  high: 'bg-red-500 text-white',
  medium: 'bg-yellow-500 text-white',
  low: 'bg-blue-500 text-white',
};

export function RecommendationPanel({
  recommendations,
  onUpgrade,
  className = '',
}: RecommendationPanelProps) {
  // Sort recommendations by priority
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary" />
          <span>Upgrade Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedRecommendations.map((recommendation, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 space-y-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{recommendation.title}</h3>
                    <Badge className={priorityColors[recommendation.priority]}>
                      {recommendation.priority.charAt(0).toUpperCase() +
                        recommendation.priority.slice(1)}{' '}
                      Priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {recommendation.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Key Benefits:</div>
                <ul className="space-y-1">
                  {recommendation.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className="text-sm text-muted-foreground flex items-start"
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                  <span className="font-medium">{recommendation.upgradePath.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recommendation.upgradePath.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm font-medium">
                    €{recommendation.upgradePath.price.toLocaleString()}
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onUpgrade(recommendation.upgradePath.name)}
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 