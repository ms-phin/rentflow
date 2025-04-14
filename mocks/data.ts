import { Property, Tenant, Notification, User } from "@/types";
import { addDays, formatISO } from "@/utils/date";

// Current user
export const currentUser: User = {
  id: "user1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

// Tenants
export const tenants: Tenant[] = [
  {
    id: "tenant1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "555-123-4567",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "tenant2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "555-987-6543",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "tenant3",
    name: "Carol Williams",
    email: "carol@example.com",
    phone: "555-456-7890",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "tenant4",
    name: "David Brown",
    email: "david@example.com",
    phone: "555-789-0123",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "tenant5",
    name: "Eva Martinez",
    email: "eva@example.com",
    phone: "555-234-5678",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

// Generate dates for rentals
const today = new Date();
const yesterday = addDays(today, -1);
const lastWeek = addDays(today, -7);
const lastMonth = addDays(today, -30);
const nextWeek = addDays(today, 7);
const in3Days = addDays(today, 3);

// Properties with units and rentals
export const properties: Property[] = [
  {
    id: "property1",
    name: "Sunset Apartments",
    address: "123 Sunset Blvd, Los Angeles, CA 90001",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ownerId: "user1",
    units: [
      {
        id: "unit1",
        name: "Apartment 101",
        propertyId: "property1",
        description: "Cozy 1-bedroom apartment with balcony",
        image:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rentals: [
          {
            id: "rental1",
            unitId: "unit1",
            tenantId: "tenant1",
            startDate: formatISO(lastMonth),
            endDate: formatISO(yesterday),
            status: "completed",
            notes: "Tenant left the apartment in good condition",
          },
          {
            id: "rental2",
            unitId: "unit1",
            tenantId: "tenant2",
            startDate: formatISO(today),
            endDate: formatISO(addDays(today, 30)),
            status: "active",
            notes: "First-time tenant",
          },
        ],
      },
      {
        id: "unit2",
        name: "Apartment 102",
        propertyId: "property1",
        description: "Spacious 2-bedroom apartment with city view",
        image:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rentals: [
          {
            id: "rental3",
            unitId: "unit2",
            tenantId: "tenant3",
            startDate: formatISO(lastWeek),
            endDate: formatISO(addDays(lastWeek, 30)),
            status: "active",
            notes: "Returning tenant",
          },
        ],
      },
    ],
  },
  {
    id: "property2",
    name: "Mountain View Homes",
    address: "456 Mountain Rd, Denver, CO 80201",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ownerId: "user1",
    units: [
      {
        id: "unit3",
        name: "Cabin 1",
        propertyId: "property2",
        description: "Rustic cabin with fireplace",
        image:
          "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rentals: [
          {
            id: "rental4",
            unitId: "unit3",
            tenantId: "tenant4",
            startDate: formatISO(in3Days),
            endDate: formatISO(addDays(in3Days, 30)),
            status: "upcoming",
            notes: "Tenant requested extra firewood",
          },
        ],
      },
      {
        id: "unit4",
        name: "Cabin 2",
        propertyId: "property2",
        description: "Modern cabin with hot tub",
        image:
          "https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rentals: [],
      },
    ],
  },
  {
    id: "property3",
    name: "Beachside Cottages",
    address: "789 Ocean Dr, Miami, FL 33101",
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ownerId: "user1",
    units: [
      {
        id: "unit5",
        name: "Cottage A",
        propertyId: "property3",
        description: "Beachfront cottage with private access",
        image:
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rentals: [
          {
            id: "rental5",
            unitId: "unit5",
            tenantId: "tenant5",
            startDate: formatISO(nextWeek),
            endDate: formatISO(addDays(nextWeek, 30)),
            status: "upcoming",
            notes: "Tenant requested beach equipment",
          },
        ],
      },
    ],
  },
];

// Notifications
export const notifications: Notification[] = [
  {
    id: "notif1",
    title: "Rental Ending Soon",
    message: "Alice Johnson's rental of Apartment 101 is ending in 3 days.",
    date: formatISO(addDays(today, -2)),
    read: true,
    type: "rental_ending",
    relatedId: "rental1",
  },
  {
    id: "notif2",
    title: "New Rental Started",
    message: "Bob Smith's rental of Apartment 101 has started today.",
    date: formatISO(today),
    read: false,
    type: "rental_started",
    relatedId: "rental2",
  },
  {
    id: "notif3",
    title: "Upcoming Rental",
    message: "David Brown will start renting Cabin 1 in 3 days.",
    date: formatISO(today),
    read: false,
    type: "rental_started",
    relatedId: "rental4",
  },
];
