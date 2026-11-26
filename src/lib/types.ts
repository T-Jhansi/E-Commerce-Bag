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
  paymentMethod: "Cash on Delivery" | "Razorpay";
  razorpayPaymentId?: string;
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

// ---------- Warranty ----------

export type WarrantyStatus =
  | "Active"
  | "Claim Requested"
  | "Claim Approved"
  | "Claim Rejected"
  | "Expired";

export const WARRANTY_STATUSES: WarrantyStatus[] = [
  "Active",
  "Claim Requested",
  "Claim Approved",
  "Claim Rejected",
  "Expired",
];

export interface WarrantyNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface WarrantyRegistration {
  id: string; // e.g. WR-1001
  productName: string;
  orderId?: string;
  serialNumber: string;
  purchaseDate: string; // ISO date
  warrantyYears: number;
  customerName: string;
  phone: string;
  email?: string;
  status: WarrantyStatus;
  claimReason?: string;
  notes: WarrantyNote[];
  createdAt: string;
  updatedAt: string;
}

export type NewWarrantyInput = Pick<
  WarrantyRegistration,
  "productName" | "orderId" | "serialNumber" | "purchaseDate" | "warrantyYears" | "customerName" | "phone" | "email"
>;

// ---------- Dealers ----------

export interface Dealer {
  id: string; // e.g. DLR-001
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  mapUrl?: string;
  lat: number;
  lng: number;
  hasClockRoom?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NewDealerInput = Omit<Dealer, "id" | "createdAt" | "updatedAt">;

// ---------- Clock Room (paid location booking with QR/OTP access) ----------

export type BookingStatus = "Reserved" | "Checked In" | "Claimed" | "Cancelled";

export const BOOKING_STATUSES: BookingStatus[] = [
  "Reserved",
  "Checked In",
  "Claimed",
  "Cancelled",
];

export interface BookingNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface ClockRoomBooking {
  id: string; // e.g. CRB-1001
  dealerId: string;
  dealerName: string;
  dealerAddress: string;
  customerName: string;
  phone: string;
  email?: string;
  bagDescription: string;
  itemCount: number;
  durationDays: number;
  dropOffDate: string; // ISO date, planned
  amount: number; // INR, amount paid
  razorpayOrderId: string;
  razorpayPaymentId: string;
  otp: string; // 6-digit access code, also embedded in the QR payload
  status: BookingStatus;
  checkedInAt?: string;
  claimedAt?: string;
  notes: BookingNote[];
  createdAt: string;
  updatedAt: string;
}

export type NewBookingInput = Pick<
  ClockRoomBooking,
  | "dealerId"
  | "dealerName"
  | "dealerAddress"
  | "customerName"
  | "phone"
  | "email"
  | "bagDescription"
  | "itemCount"
  | "durationDays"
  | "dropOffDate"
  | "amount"
  | "razorpayOrderId"
  | "razorpayPaymentId"
>;
