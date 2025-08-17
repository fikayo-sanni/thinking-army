import { Customer } from '@/lib/types/crm.types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Building2, Tag, ChevronRight } from 'lucide-react';
import { safeFormatDate } from '@/lib/utils';

interface CustomerCardProps {
  customer: Customer;
  onViewDetails?: (customerId: string) => void;
}

const statusColors = {
  active: 'bg-green-500/10 text-green-500 dark:bg-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20',
  pending: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20',
} as const;

const sourceColors = {
  website: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20',
  referral: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20',
  direct: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20',
  other: 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20',
} as const;

export function CustomerCard({ customer, onViewDetails }: CustomerCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{customer.name}</h3>
          <p className="text-sm text-muted-foreground">{customer.company}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className={statusColors[customer.status]}>
            {customer.status}
          </Badge>
          <Badge variant="secondary" className={sourceColors[customer.source]}>
            {customer.source}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${customer.email}`} className="hover:text-primary">
              {customer.email}
            </a>
          </div>
          {customer.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <a href={`tel:${customer.phone}`} className="hover:text-primary">
                {customer.phone}
              </a>
            </div>
          )}
          {customer.industry && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{customer.industry}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="h-4 w-4" />
            <div className="flex gap-1">
              {customer.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-3">
            <div className="text-xs text-muted-foreground">
              Added {safeFormatDate(customer.createdAt)}
            </div>
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
                onClick={() => onViewDetails(customer.id)}
              >
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 