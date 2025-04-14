export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  image?: string;
  ownerId: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  name: string;
  propertyId: string;
  description?: string;
  image?: string;
  rentals: Rental[];
}

export interface Tenant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface Rental {
  id: string;
  unitId: string;
  tenantId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string (30 days after startDate)
  status: "active" | "upcoming" | "completed" | "cancelled";
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string; // ISO date string
  read: boolean;
  type: "rental_ending" | "rental_started" | "rental_completed" | "system";
  relatedId?: string; // ID of related rental, property, etc.
}
