import AgentDetailsClient from './client';

// This is a server component that handles static params and data fetching
export async function generateStaticParams() {
  // Include all possible static paths
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: 'new' },
    { id: 'templates' },
  ];
}

export default function AgentDetailsPage({ params }: { params: { id: string } }) {
  // If it's a special route, render the appropriate component
  if (params.id === 'new') {
    return <div>New Agent Page</div>;
  }

  if (params.id === 'templates') {
    return <div>Templates Page</div>;
  }

  // For regular agent IDs, render the client component
  return <AgentDetailsClient id={params.id} />;
} 