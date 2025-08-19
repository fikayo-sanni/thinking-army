'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
  GitBranch,
  List,
  FileText,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { LucideIcon } from 'lucide-react';

// Define types
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  industry: string;
  size: string;
  website?: string;
  notes?: string;
}

interface JourneyTemplate {
  id: string;
  name: string;
  description: string;
  stages: string[];
}

interface CustomerJourney {
  id: string;
  name: string;
  customer: {
    name: string;
    industry: string;
    size: string;
  };
  stage: string;
  value: number;
  lastActivity: string;
  nextAction: string;
  nextActionDate: string;
  assignedTo: string;
  template: string;
  progress: number;
  activities: Array<{
    type: string;
    description: string;
    date: string;
    icon: LucideIcon;
  }>;
}

interface DragResult {
  destination: { droppableId: string } | null;
  source: { droppableId: string };
  draggableId: string;
}

// Journey creation form schema
const journeyFormSchema = z.object({
  name: z.string().min(1, 'Journey name is required'),
  customer: z.string().min(1, 'Customer is required'),
  template: z.string().min(1, 'Template is required'),
  description: z.string().optional(),
});

// Add card styles
const cardStyles = {
  base: "bg-white dark:bg-[#1A1E2E] border border-[#E4E6EB] dark:border-[#2D3548] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-150 hover:border-[#DADCE0] dark:hover:border-[#3D4663] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.3)]",
  header: "flex items-center justify-between p-4 border-b border-[#E4E6EB] dark:border-[#2D3548]",
  headerLeft: "flex items-center space-x-3",
  iconContainer: "flex items-center justify-center w-8 h-8 rounded-lg bg-[#297EFF]/10 dark:bg-[#4D8DFF]/10",
  icon: "w-5 h-5 text-[#297EFF] dark:text-[#4D8DFF]",
  title: "text-[15px] font-medium text-[#202124] dark:text-[#E6E6E6]",
  subtitle: "text-[12px] text-[#5F6368] dark:text-[#94A3B8] mt-0.5",
  content: "p-4",
};

// Add view options
const viewOptions = [
  { label: 'Kanban', value: 'kanban', icon: GitBranch },
  { label: 'List', value: 'list', icon: List },
] as const;

// Add journey stages
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

// Customer form schema
const customerFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().min(2, 'Company name is required'),
  industry: z.string().min(2, 'Industry is required'),
  size: z.string().min(1, 'Company size is required'),
  website: z.string().url('Valid website URL is required').optional(),
  notes: z.string().optional(),
});

// Stage form schema
const stageFormSchema = z.object({
  name: z.string().min(2, 'Stage name is required'),
  description: z.string().optional(),
  color: z.string().min(4, 'Color is required'),
});

// Sample journey data
const sampleJourneys = [
  {
    id: '1',
    name: 'Enterprise Solution Implementation',
    customer: {
      name: 'TechCorp Solutions',
      industry: 'Technology',
      size: '50-200',
    },
    stage: 'lead',
    value: 75000,
    lastActivity: '2 hours ago',
    nextAction: 'Technical requirements review',
    nextActionDate: '2024-03-25',
    assignedTo: 'Sarah Chen',
    template: 'Enterprise Sales',
    progress: 25,
    activities: [
      {
        type: 'email',
        description: 'Sent initial proposal',
        date: '2024-03-20',
        icon: Mail,
      },
      {
        type: 'meeting',
        description: 'Discovery call completed',
        date: '2024-03-18',
        icon: Calendar,
      },
    ],
  },
  {
    id: '2',
    name: 'Global Logistics Platform Upgrade',
    customer: {
      name: 'Global Logistics Inc',
      industry: 'Transportation',
      size: '200-500',
    },
    stage: 'qualified',
    value: 120000,
    lastActivity: '1 day ago',
    nextAction: 'Solution architecture presentation',
    nextActionDate: '2024-03-26',
    assignedTo: 'Marcus Rodriguez',
    template: 'Enterprise Sales',
    progress: 45,
    activities: [
      {
        type: 'meeting',
        description: 'Technical deep dive completed',
        date: '2024-03-19',
        icon: Calendar,
      },
      {
        type: 'task',
        description: 'ROI analysis completed',
        date: '2024-03-17',
        icon: CheckCircle2,
      },
    ],
  },
  {
    id: '3',
    name: 'Learning Management System Integration',
    customer: {
      name: 'EduTech Academy',
      industry: 'Education',
      size: '100-250',
    },
    stage: 'proposal',
    value: 45000,
    lastActivity: '3 hours ago',
    nextAction: 'Contract review meeting',
    nextActionDate: '2024-03-27',
    assignedTo: 'Emma Thompson',
    template: 'Education Solution',
    progress: 65,
    activities: [
      {
        type: 'document',
        description: 'Proposal sent for review',
        date: '2024-03-20',
        icon: FileText,
      },
      {
        type: 'meeting',
        description: 'Stakeholder presentation',
        date: '2024-03-15',
        icon: Users,
      },
    ],
  },
  {
    id: '4',
    name: 'Healthcare Analytics Platform',
    customer: {
      name: 'MediCare Systems',
      industry: 'Healthcare',
      size: '500+',
    },
    stage: 'negotiation',
    value: 250000,
    lastActivity: '5 hours ago',
    nextAction: 'Final pricing discussion',
    nextActionDate: '2024-03-28',
    assignedTo: 'David Kim',
    template: 'Enterprise Healthcare',
    progress: 85,
    activities: [
      {
        type: 'contract',
        description: 'Contract terms negotiation',
        date: '2024-03-21',
        icon: FileText,
      },
      {
        type: 'meeting',
        description: 'Executive presentation',
        date: '2024-03-19',
        icon: Users,
      },
    ],
  },
  {
    id: '5',
    name: 'Retail Analytics Implementation',
    customer: {
      name: 'RetailPro Corp',
      industry: 'Retail',
      size: '1000+',
    },
    stage: 'closed',
    value: 180000,
    lastActivity: '1 hour ago',
    nextAction: 'Implementation kickoff',
    nextActionDate: '2024-03-29',
    assignedTo: 'Lisa Wang',
    template: 'Enterprise Retail',
    progress: 100,
    activities: [
      {
        type: 'contract',
        description: 'Contract signed',
        date: '2024-03-22',
        icon: CheckCircle2,
      },
      {
        type: 'meeting',
        description: 'Implementation planning',
        date: '2024-03-21',
        icon: Calendar,
      },
    ],
  },
  {
    id: '6',
    name: 'Manufacturing Process Automation',
    customer: {
      name: 'Industrial Solutions Ltd',
      industry: 'Manufacturing',
      size: '200-500',
    },
    stage: 'lead',
    value: 95000,
    lastActivity: '4 hours ago',
    nextAction: 'Process assessment workshop',
    nextActionDate: '2024-03-26',
    assignedTo: 'James Wilson',
    template: 'Industrial Automation',
    progress: 15,
    activities: [
      {
        type: 'email',
        description: 'Initial requirements gathered',
        date: '2024-03-20',
        icon: Mail,
      },
      {
        type: 'meeting',
        description: 'Introductory call completed',
        date: '2024-03-18',
        icon: Calendar,
      },
    ],
  },
  {
    id: '7',
    name: 'Financial Services Platform',
    customer: {
      name: 'FinTech Innovations',
      industry: 'Finance',
      size: '50-200',
    },
    stage: 'qualified',
    value: 150000,
    lastActivity: '2 hours ago',
    nextAction: 'Security assessment review',
    nextActionDate: '2024-03-27',
    assignedTo: 'Rachel Chen',
    template: 'FinTech Solution',
    progress: 35,
    activities: [
      {
        type: 'document',
        description: 'Security requirements documented',
        date: '2024-03-21',
        icon: Shield,
      },
      {
        type: 'meeting',
        description: 'Technical architecture review',
        date: '2024-03-19',
        icon: GitBranch,
      },
    ],
  },
  {
    id: '8',
    name: 'Smart City Infrastructure',
    customer: {
      name: 'MetroTech Solutions',
      industry: 'Government',
      size: '1000+',
    },
    stage: 'proposal',
    value: 500000,
    lastActivity: '6 hours ago',
    nextAction: 'Stakeholder presentation',
    nextActionDate: '2024-03-28',
    assignedTo: 'Michael Chang',
    template: 'Government Enterprise',
    progress: 55,
    activities: [
      {
        type: 'presentation',
        description: 'Solution proposal prepared',
        date: '2024-03-22',
        icon: FileText,
      },
      {
        type: 'meeting',
        description: 'Requirements workshop',
        date: '2024-03-20',
        icon: Users,
      },
    ],
  },
];

export default function CRMDashboard() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIndustry, setSelectedIndustry] = React.useState('all');
  const [selectedTemplate, setSelectedTemplate] = React.useState('all');
  const [selectedJourney, setSelectedJourney] = React.useState(null);
  const [showFilters, setShowFilters] = React.useState(false);
  const [isCreatingJourney, setIsCreatingJourney] = React.useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<'kanban' | 'list'>('kanban');
  const [isAddingStage, setIsAddingStage] = React.useState(false);

  // Form setup
  const form = useForm({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      name: '',
      customer: '',
      template: '',
      description: '',
    },
  });

  // Customer form
  const customerForm = useForm({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      industry: '',
      size: '',
      website: '',
      notes: '',
    },
  });

  // Stage form
  const stageForm = useForm({
    resolver: zodResolver(stageFormSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#297EFF',
    },
  });

  // Fetch customers and templates
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: () => crmService.getCustomers(),
    gcTime: Infinity, // Use gcTime instead of cacheTime
    staleTime: Infinity,
  });

  const { data: templates = [] } = useQuery<JourneyTemplate[]>({
    queryKey: ['journey-templates'],
    queryFn: () => crmService.getJourneyTemplates(),
    gcTime: Infinity,
    staleTime: Infinity,
  });

  const { 
    data: journeyData = sampleJourneys as CustomerJourney[], 
    refetch: refetchJourneys,
  } = useQuery<CustomerJourney[]>({
    queryKey: ['customer-journeys'],
    queryFn: () => crmService.getCustomerJourneys('all'),
    initialData: sampleJourneys as CustomerJourney[],
    gcTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Mutation for updating journey stage
  const { mutate: updateJourneyStage } = useMutation({
    mutationFn: ({ journeyId, stage, progress }: { journeyId: string; stage: string; progress: number }) =>
      crmService.updateJourneyStage(journeyId, { stage, progress }),
    onMutate: async ({ journeyId, stage, progress }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['customer-journeys'] });

      // Snapshot the previous value
      const previousJourneys = queryClient.getQueryData(['customer-journeys']);

      // Optimistically update to the new value
      queryClient.setQueryData(['customer-journeys'], (old: CustomerJourney[]) => {
        return old.map(journey => 
          journey.id === journeyId 
            ? { ...journey, stage, progress }
            : journey
        );
      });

      // Return a context object with the snapshotted value
      return { previousJourneys };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousJourneys) {
        queryClient.setQueryData(['customer-journeys'], context.previousJourneys);
      }
      toast({
        title: "Error",
        description: "Failed to update journey stage. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we're up to date
      queryClient.invalidateQueries({ queryKey: ['customer-journeys'] });
    },
  });

  // Handle form submissions
  const onCreateJourney = async (data: z.infer<typeof journeyFormSchema>) => {
    try {
      await crmService.createJourney(data);
      setIsCreatingJourney(false);
      form.reset();
      refetchJourneys();
      toast({
        title: "Journey created",
        description: "The customer journey has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create journey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onCreateCustomer = async (data: z.infer<typeof customerFormSchema>) => {
    try {
      await crmService.createCustomer(data);
      setIsCreatingCustomer(false);
      customerForm.reset();
      toast({
        title: "Customer added",
        description: "New customer has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onCreateStage = async (data: z.infer<typeof stageFormSchema>) => {
    try {
      const newStage = {
        id: data.name.toLowerCase().replace(/\s+/g, '-'),
        name: data.name,
        description: data.description,
        color: `text-[${data.color}]`,
        bgColor: `bg-[${data.color}]/10`,
        borderColor: `border-[${data.color}]/20`,
      };
      stages.push(newStage);
      setIsAddingStage(false);
      stageForm.reset();
      toast({
        title: "Stage added",
        description: "New journey stage has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add stage. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter journeys based on search and filters
  const filteredJourneys = journeyData.filter(journey => {
    const matchesSearch = 
      searchQuery === '' ||
      journey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journey.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry =
      selectedIndustry === 'all' || journey.customer.industry.toLowerCase() === selectedIndustry.toLowerCase();
    
    const matchesTemplate =
      selectedTemplate === 'all' || journey.template === selectedTemplate;

    return matchesSearch && matchesIndustry && matchesTemplate;
  });

  // Handle drag and drop
  const handleDragEnd = async (result: DragResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const stageIndex = stages.findIndex(s => s.id === destination.droppableId);
    const progress = Math.round(((stageIndex + 1) / stages.length) * 100);

    updateJourneyStage({
      journeyId: draggableId,
      stage: destination.droppableId,
      progress,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202124] dark:text-[#E6E6E6]">Customer Journeys</h1>
          <p className="text-[#5F6368] dark:text-[#94A3B8] mt-1">
            Track and manage customer relationships across stages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isCreatingCustomer} onOpenChange={setIsCreatingCustomer}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Add a new customer to your CRM system
                </DialogDescription>
              </DialogHeader>
              <Form {...customerForm}>
                <form onSubmit={customerForm.handleSubmit(onCreateCustomer)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={customerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={customerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={customerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 234 567 8900" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={customerForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={customerForm.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={customerForm.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="501-1000">501-1000 employees</SelectItem>
                              <SelectItem value="1000+">1000+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={customerForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={customerForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add any additional notes about the customer"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreatingCustomer(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Customer</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreatingJourney} onOpenChange={setIsCreatingJourney}>
            <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
                New Journey
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Journey</DialogTitle>
                <DialogDescription>
                  Start a new customer journey by filling out the details below.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onCreateJourney)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Journey Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter journey name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Journey Template</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter journey description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreatingJourney(false)}>
                      Cancel
        </Button>
                    <Button type="submit">Create Journey</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={cardStyles.base}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Journeys
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{journeyData.filter(j => j.progress === 100).length}</div>
            <p className="text-xs text-muted-foreground">
              +2 this week
            </p>
          </CardContent>
        </Card>
        <Card className={cardStyles.base}>
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
        <Card className={cardStyles.base}>
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
        <Card className={cardStyles.base}>
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search journeys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[130px]">
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
            <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2" onClick={() => setShowFilters(true)}>
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
          <Select value={currentView} onValueChange={(value: 'kanban' | 'list') => setCurrentView(value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              {viewOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stage Management Dialog */}
      <Dialog open={isAddingStage} onOpenChange={setIsAddingStage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Stage</DialogTitle>
            <DialogDescription>
              Create a new stage for customer journeys
            </DialogDescription>
          </DialogHeader>
          <Form {...stageForm}>
            <form onSubmit={stageForm.handleSubmit(onCreateStage)} className="space-y-6">
              <FormField
                control={stageForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Discovery" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stageForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the purpose of this stage"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={stageForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input type="color" {...field} className="w-20 h-10" />
                        <Input {...field} placeholder="#297EFF" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingStage(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Stage</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Kanban Board View */}
      {currentView === 'kanban' && (
      <div className="rounded-lg border bg-muted/10">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Journey Stages</h3>
            <Button variant="outline" size="sm" onClick={() => setIsAddingStage(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stage
            </Button>
          </div>
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
                                                {journey.name}
                                            </h4>
                                            <Badge variant="secondary" className={cn(stage.bgColor, stage.color)}>
                                              {formatCurrency(journey.value)}
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                            <Building2 className="h-3 w-3" />
                                              <span>{journey.customer.name}</span>
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
      )}

      {/* List View */}
      {currentView === 'list' && (
        <div className="grid gap-4">
          {filteredJourneys.map((journey) => (
            <Card key={journey.id} className={cardStyles.base}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>{journey.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {journey.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={cn(
                      journey.progress === 100 ? 'bg-green-500/10 text-green-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    )}>
                      {journey.progress === 100 ? 'COMPLETED' : 'IN PROGRESS'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => setSelectedJourney(journey)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{journey.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${journey.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Journey Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{journey.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{journey.template}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{safeFormatDate(journey.nextActionDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{journey.assignedTo}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
                  {selectedJourney.name}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedJourney.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedJourney.template}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <History className="h-4 w-4" />
                    View History
                  </Button>
                </div>
              </div>

              {/* Journey Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Journey Progress</h4>
                  <Badge variant="outline" className={cn(
                    selectedJourney.progress === 100 ? 'bg-green-500/10 text-green-500' :
                    'bg-yellow-500/10 text-yellow-500'
                  )}>
                    {selectedJourney.progress === 100 ? 'COMPLETED' : 'IN PROGRESS'}
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary rounded-full"
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
                  {selectedJourney.activities?.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="rounded-full p-2 bg-primary/10">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.date}
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