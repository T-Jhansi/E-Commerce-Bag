export type TicketStatus =
  | "Received"
  | "In Service"
  | "Ready for Pickup"
  | "Returned"
  | "Cancelled";

export const TICKET_STATUSES: TicketStatus[] = [
  "Received",
  "In Service",
  "Ready for Pickup",
  "Returned",
  "Cancelled",
];

export interface TicketNote {
  id: string;
  date: string; // ISO timestamp
  author: string;
  text: string;
}

export interface ServiceTicket {
  id: string; // e.g. FMB-1001
  customerName: string;
  phone: string;
  email?: string;
  bagType: string;
  bagBrand?: string;
  bagTag: string; // serial / tag number on the bag
  issue: string;
  dropOffDate: string; // ISO date
  estimatedCompletion?: string; // ISO date
  technician?: string;
  status: TicketStatus;
  notes: TicketNote[];
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export type NewTicketInput = Pick<
  ServiceTicket,
  | "customerName"
  | "phone"
  | "email"
  | "bagType"
  | "bagBrand"
  | "bagTag"
  | "issue"
>;
