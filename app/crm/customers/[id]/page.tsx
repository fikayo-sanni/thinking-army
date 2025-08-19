import { notFound } from 'next/navigation';
import { crmService } from '@/lib/services/crm.service';
import { CustomerDetailsContent } from './CustomerDetailsContent';

// This function generates the static paths at build time
export async function generateStaticParams() {
  try {
    const customers = await crmService.getCustomers();
    return customers.map((customer) => ({
      id: customer.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Get static props for the page
async function getCustomerData(id: string) {
  try {
    const [customer, journeys, interactions, metrics] = await Promise.all([
      crmService.getCustomerById(id),
      crmService.getCustomerJourneys(id),
      crmService.getCustomerInteractions(id),
      crmService.getCustomerMetrics(id),
    ]);

    if (!customer) {
      return null;
    }

    return {
      customer,
      journeys,
      interactions,
      metrics,
    };
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return null;
  }
}

export default async function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const data = await getCustomerData(params.id);

  if (!data) {
    notFound();
  }

  return <CustomerDetailsContent {...data} />;
} 