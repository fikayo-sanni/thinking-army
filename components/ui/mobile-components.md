# Mobile Components Documentation

This document outlines the mobile-optimized components available in the frontend application and how to use them effectively.

## Overview

The mobile components are designed to provide better user experience on mobile devices with:
- Touch-friendly interactions (44px minimum touch targets)
- Responsive typography and spacing
- Mobile-first responsive design
- Enhanced accessibility
- Optimized loading states

## Components

### MobileTable
Automatically switches between desktop table view and mobile card view.

```tsx
import { MobileTable } from "@/components/ui/mobile-table"

const columns = [
  { key: "name", header: "Name", hiddenOnMobile: false },
  { key: "email", header: "Email", hiddenOnMobile: true },
  { key: "status", header: "Status", hiddenOnMobile: false }
]

<MobileTable 
  columns={columns}
  data={data}
  keyField="id"
  emptyMessage="No users found"
/>
```

### MobileFilterControls
Provides collapsible filter controls for mobile screens.

```tsx
import { MobileFilterControls } from "@/components/layout/mobile-filter-controls"

<MobileFilterControls title="Search Filters">
  <Select>...</Select>
  <Input placeholder="Search..." />
</MobileFilterControls>
```

### MobileForm Components
Form components optimized for mobile input.

```tsx
import { 
  MobileForm, 
  MobileFormField, 
  MobileInput, 
  MobileButton,
  MobileFormActions 
} from "@/components/ui/mobile-form"

<MobileForm title="Contact Form" description="Get in touch with us">
  <MobileFormField label="Name" required>
    <MobileInput placeholder="Enter your name" />
  </MobileFormField>
  
  <MobileFormField label="Email" required>
    <MobileInput type="email" placeholder="Enter your email" />
  </MobileFormField>
  
  <MobileFormActions>
    <MobileButton variant="outline" fullWidth>Cancel</MobileButton>
    <MobileButton variant="primary" fullWidth>Submit</MobileButton>
  </MobileFormActions>
</MobileForm>
```

### MobileNavigation
Touch-friendly navigation with expandable sections.

```tsx
import { MobileNavigation, defaultMobileNavItems } from "@/components/ui/mobile-navigation"

<MobileNavigation items={defaultMobileNavItems} />
```

### MobileMetricCard
Compact metric display for mobile screens.

```tsx
import { MobileMetricCard } from "@/components/ui/metric-card"
import { TrendingUp } from "lucide-react"

<MobileMetricCard
  title="Total Revenue"
  value="$12,345"
  icon={TrendingUp}
  change={{ value: "+12.5%", type: "positive" }}
/>
```

### MobileChartCard
Chart container optimized for mobile viewing.

```tsx
import { MobileChartCard } from "@/components/ui/mobile-chart-card"

<MobileChartCard 
  title="Sales Chart" 
  description="Monthly sales data"
  height={200}
>
  <ResponsiveContainer width="100%" height="100%">
    {/* Your chart component */}
  </ResponsiveContainer>
</MobileChartCard>
```

## Mobile-First CSS Classes

The following utility classes are available for mobile-specific styling:

### Spacing
- `mobile-px-4` - Mobile-specific horizontal padding
- `mobile-py-3` - Mobile-specific vertical padding
- `mobile-card` - Mobile-optimized card styling

### Typography
- `mobile-text-lg` - Mobile-optimized large text
- `mobile-text-sm` - Mobile-optimized small text

### Layout
- `mobile-grid-1` - Single column grid on mobile
- `mobile-nav-item` - Navigation item with proper touch targets
- `touch-target` - Ensures minimum 44px touch targets

### Interactions
- `mobile-scroll` - Touch-optimized scrolling
- `mobile-dropdown` - Full-width dropdowns on mobile

## Responsive Design Guidelines

### Breakpoints
- Mobile: < 768px (sm breakpoint)
- Tablet: 768px - 1024px (md breakpoint)  
- Desktop: > 1024px (lg breakpoint)

### Grid Layout Patterns
```tsx
// Single column on mobile, 2 on tablet, 3 on desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">

// Single column on mobile, 2 on desktop
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
```

### Spacing Patterns
```tsx
// Progressive spacing: smaller on mobile, larger on desktop
<div className="p-2 sm:p-3 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
```

## Best Practices

1. **Touch Targets**: Ensure all interactive elements are at least 44px in height/width
2. **Typography**: Use mobile-optimized text sizes to prevent zoom on iOS
3. **Navigation**: Hide complex navigation behind hamburger menus on mobile
4. **Forms**: Use larger input fields and buttons for easier touch interaction
5. **Content**: Prioritize essential content on mobile, hide secondary information
6. **Loading States**: Use mobile-specific skeletons and loading indicators
7. **Images**: Use responsive images with appropriate sizes for mobile screens

## Testing

Test mobile responsiveness using:
- Browser developer tools (mobile simulation)
- Physical devices (iOS/Android)
- Various screen sizes (320px to 768px width)
- Touch interactions vs mouse interactions
- Different orientations (portrait/landscape)

## Accessibility

Mobile components include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management for touch interactions 