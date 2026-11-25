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

// ---------- Catalogue ----------

export type ProductCategory =
  | "Backpacks"
  | "Travel"
  | "Laptop Bags"
  | "Totes"
  | "Accessories";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Backpacks",
  "Travel",
  "Laptop Bags",
  "Totes",
  "Accessories",
];

export interface Product {
  id: string; // e.g. BAG-001
  slug: string;
  name: string;
  category: ProductCategory;
  price: number; // INR
  compareAtPrice?: number;
  description: string;
  colorway: string; // used to derive the placeholder art + a real attribute shown on the PDP
  image: string; // path under /public, e.g. /products/backpacks.jpg
  stock: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NewProductInput = Omit<Product, "id" | "slug" | "createdAt" | "updatedAt">;

// ---------- Cart ----------

export interface CartItem {
  productId: string;
  quantity: number;
}

// ---------- Orders ----------

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export interface OrderLine {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface Order {
  id: string; // e.g. ORD-1001
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: "Cash on Delivery" | "Card / UPI (mock)";
  status: OrderStatus;
  notes: OrderNote[];
  createdAt: string;
  updatedAt: string;
}

// ---------- Customer account (mock auth) ----------

export interface CustomerAccount {
  name: string;
  email: string;
  phone: string;
}
