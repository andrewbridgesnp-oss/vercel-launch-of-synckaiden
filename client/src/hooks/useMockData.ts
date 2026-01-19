/**
 * useMockData Hook
 * Provides mock data when API returns empty or null
 * Used as fallback to ensure pages show data even with empty database
 */

export const mockContacts = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@acme.com",
    phone: "+1-555-0101",
    company: "Acme Corp",
    status: "customer",
  },
  {
    id: 2,
    firstName: "Michael",
    lastName: "Chen",
    email: "m.chen@techstart.io",
    phone: "+1-555-0102",
    company: "TechStart Inc",
    status: "prospect",
  },
  {
    id: 3,
    firstName: "Emma",
    lastName: "Williams",
    email: "emma.w@globalventures.com",
    phone: "+1-555-0103",
    company: "Global Ventures",
    status: "lead",
  },
];

export const mockOrders = [
  { id: 1, customerId: 1, amount: 2500 * 100, status: "completed" },
  { id: 2, customerId: 4, amount: 1200 * 100, status: "completed" },
  { id: 3, customerId: 2, amount: 500 * 100, status: "pending" },
  { id: 4, customerId: 1, amount: 3500 * 100, status: "completed" },
  { id: 5, customerId: 5, amount: 800 * 100, status: "shipped" },
];

export const mockStats = {
  total: mockContacts.length,
  leads: mockContacts.filter(c => c.status === "lead").length,
  prospects: mockContacts.filter(c => c.status === "prospect").length,
  customers: mockContacts.filter(c => c.status === "customer").length,
};

export function useFallbackData<T>(data: T | undefined | null, fallback: T): T {
  return (data && Object.keys(data).length > 0) ? data : fallback;
}
