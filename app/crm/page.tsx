'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { crmService } from '@/lib/services/crm.service';
import { formatNumber, formatCurrency, safeFormatDate } from '@/lib/utils';
import {
  Search,
  Plus,
  Filter,
  Users,
  Clock,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreVertical,
  Calendar,
  Building2,
  UserPlus,
  Mail,
  Phone,
  Globe,
  History,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for journey stages
const stages = [
  {
    id: 'lead',
    name: 'Lead',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    id: 'qualified',
    name: 'Qualified',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    id: 'proposal',
    name: 'Proposal',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  {
    id: 'negotiation',
    name: 'Negotiation',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
  {
    id: 'closed',
    name: 'Closed',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
];

// Mock data for customers in journey stages
const mockJourneys = [
  {
    id: '1',
    customer: {
      name: 'TechCorp Solutions',
      industry: 'Technology',
      size: '50-200',
    },
    stage: 'lead',
    value: 25000,
    lastActivity: '2 hours ago',
    nextAction: 'Follow-up call',
    nextActionDate: '2024-03-20',
    assignedTo: 'Sarah Chen',
    template: 'Enterprise Sales',
    progress: 25,
  },
  {
    id: '2',
    customer: {
      name: 'Global Logistics Inc',
      industry: 'Transportation',
      size: '200-500',
    },
    stage: 'qualified',
    value: 75000,
    lastActivity: '1 day ago',
    nextAction: 'Product demo',
    nextActionDate: '2024-03-21',
    assignedTo: 'Marcus Rodriguez',
    template: 'Corporate Funnel',
    progress: 45,
  },
  {
    id: '3',
    customer: {
      name: 'EduTech Academy',
      industry: 'Education',
      size: '100-250',
    },
    stage: 'proposal',
    value: 45000,
    lastActivity: '3 hours ago',
    nextAction: 'Proposal review',
    nextActionDate: '2024-03-22',
    assignedTo: 'Emma Thompson',
    template: 'Education Funnel',
    progress: 65,
  },
  // Add more mock journeys...
];

export default function CRMDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState('all');
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter journeys based on search and filters
  const filteredJourneys = mockJourneys.filter(journey => {
    const matchesSearch = 
      searchQuery === '' ||
      journey.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journey.customer.industry.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry =
      selectedIndustry === 'all' || journey.customer.industry === selectedIndustry;
    
    const matchesTemplate =
      selectedTemplate === 'all' || journey.template === selectedTemplate;

    return matchesSearch && matchesIndustry && matchesTemplate;
  });

  // Handle drag and drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    // Update journey stage (in a real app, this would be an API call)
    const journey = mockJourneys.find(j => j.id === draggableId);
    if (journey) {
      journey.stage = destination.droppableId;
      // Update progress based on stage position
      const stageIndex = stages.findIndex(s => s.id === destination.droppableId);
      journey.progress = Math.round(((stageIndex + 1) / stages.length) * 100);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Journeys</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage customer relationships across stages
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Journeys
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Journey Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 days</div>
            <p className="text-xs text-muted-foreground">
              -2 days vs last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Success Rate
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              +5% this quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pipeline Value
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€145,000</div>
            <p className="text-xs text-muted-foreground">
              +€23,000 this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Transportation">Transportation</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            <SelectItem value="Enterprise Sales">Enterprise Sales</SelectItem>
            <SelectItem value="Corporate Funnel">Corporate Funnel</SelectItem>
            <SelectItem value="Education Funnel">Education Funnel</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2" onClick={() => setShowFilters(true)}>
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Kanban Board with Drag and Drop */}
      <div className="rounded-lg border bg-muted/10">
        <DragDropContext onDragEnd={handleDragEnd}>
          <ScrollArea className="h-[calc(100vh-20rem)] rounded-lg">
            <div className="flex gap-4 p-4">
              {stages.map((stage) => (
                <Droppable key={stage.id} droppableId={stage.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-shrink-0 w-80"
                    >
                      {/* Stage Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className={cn("font-semibold", stage.color)}>
                            {stage.name}
                          </h3>
                          <Badge variant="secondary" className={cn("bg-background", stage.borderColor)}>
                            {filteredJourneys.filter(j => j.stage === stage.id).length}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Journey Cards */}
                      <div className="space-y-4">
                        <AnimatePresence>
                          {filteredJourneys
                            .filter(journey => journey.stage === stage.id)
                            .map((journey, index) => (
                              <Draggable
                                key={journey.id}
                                draggableId={journey.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <motion.div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    style={{
                                      ...provided.draggableProps.style,
                                      transform: snapshot.isDragging
                                        ? provided.draggableProps.style.transform
                                        : 'none',
                                    }}
                                  >
                                    <Card 
                                      className={cn(
                                        "cursor-pointer hover:border-primary/50 transition-colors",
                                        snapshot.isDragging && "shadow-lg"
                                      )}
                                      onClick={() => setSelectedJourney(journey)}
                                    >
                                      <CardContent className="p-4 space-y-4">
                                        {/* Customer Info */}
                                        <div>
                                          <div className="flex items-center justify-between">
                                            <h4 className="font-semibold truncate">
                                              {journey.customer.name}
                                            </h4>
                                            <Badge variant="secondary" className={cn(stage.bgColor, stage.color)}>
                                              {formatCurrency(journey.value)}
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                            <Building2 className="h-3 w-3" />
                                            <span>{journey.customer.industry}</span>
                                            <span>•</span>
                                            <span>{journey.customer.size}</span>
                                          </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="space-y-1">
                                          <div className="h-2 rounded-full bg-muted">
                                            <div
                                              className={cn("h-full rounded-full", stage.bgColor)}
                                              style={{ width: `${journey.progress}%` }}
                                            />
                                          </div>
                                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{journey.template}</span>
                                            <span>{journey.progress}%</span>
                                          </div>
                                        </div>

                                        {/* Next Action */}
                                        <div className="flex items-center gap-2 text-sm">
                                          <Calendar className="h-4 w-4 text-muted-foreground" />
                                          <span className="flex-1 truncate">
                                            {journey.nextAction}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            {journey.nextActionDate}
                                          </span>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-2 border-t">
                                          <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                              {journey.assignedTo.charAt(0)}
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                              {journey.lastActivity}
                                            </span>
                                          </div>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ArrowRight className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                )}
                              </Draggable>
                            ))}
                        </AnimatePresence>
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DragDropContext>
      </div>

      {/* Journey Details Dialog */}
      <Dialog open={selectedJourney !== null} onOpenChange={() => setSelectedJourney(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Journey Details</DialogTitle>
            <DialogDescription>
              View and manage customer journey details
            </DialogDescription>
          </DialogHeader>

          {selectedJourney && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {selectedJourney.customer.name}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedJourney.customer.industry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedJourney.customer.size} employees</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Button>
                </div>
              </div>

              {/* Journey Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Journey Progress</h4>
                  <Badge variant="secondary" className={cn(
                    stages.find(s => s.id === selectedJourney.stage)?.bgColor,
                    stages.find(s => s.id === selectedJourney.stage)?.color
                  )}>
                    {stages.find(s => s.id === selectedJourney.stage)?.name}
                  </Badge>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      stages.find(s => s.id === selectedJourney.stage)?.bgColor
                    )}
                    style={{ width: `${selectedJourney.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{selectedJourney.template}</span>
                  <span>{selectedJourney.progress}% Complete</span>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-4">
                <h4 className="font-medium">Recent Activity</h4>
                <div className="space-y-4">
                  {[
                    {
                      type: 'message',
                      content: 'Sent follow-up email',
                      time: '2 hours ago',
                      icon: Mail,
                    },
                    {
                      type: 'stage',
                      content: 'Moved to Qualified stage',
                      time: '1 day ago',
                      icon: ArrowRight,
                    },
                    {
                      type: 'note',
                      content: 'Added meeting notes',
                      time: '2 days ago',
                      icon: MessageSquare,
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="rounded-full p-2 bg-primary/10">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline">View All Activity</Button>
                <Button>Update Journey</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 