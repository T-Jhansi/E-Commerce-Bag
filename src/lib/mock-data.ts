import { ServiceTicket } from "./types";

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const SEED_TICKETS: ServiceTicket[] = [
  {
    id: "FMB-1001",
    customerName: "Ananya Rao",
    phone: "9845012345",
    email: "ananya.rao@example.com",
    bagType: "Laptop Backpack",
    bagBrand: "Bag Co. Voyager",
    bagTag: "BC-VY-48213",
    issue: "Main zipper is stuck and the left strap stitching has come loose.",
    dropOffDate: daysAgo(6).slice(0, 10),
    estimatedCompletion: daysFromNow(1),
    technician: "Imran Shaikh",
    status: "In Service",
    notes: [
      {
        id: "n1",
        date: daysAgo(6),
        author: "Front Desk",
        text: "Bag received, tagged, and logged. Customer requested a call before any paid repairs.",
      },
      {
        id: "n2",
        date: daysAgo(3),
        author: "Imran Shaikh",
        text: "Zipper slider replaced. Re-stitching the strap now, no extra cost — covered under warranty.",
      },
    ],
    createdAt: daysAgo(6),
    updatedAt: daysAgo(3),
  },
  {
    id: "FMB-1002",
    customerName: "Rahul Verma",
    phone: "9900112233",
    bagType: "Travel Duffel",
    bagBrand: "Bag Co. Trailhead",
    bagTag: "BC-TH-10042",
    issue: "Wheel on the bottom-left corner is cracked.",
    dropOffDate: daysAgo(10).slice(0, 10),
    estimatedCompletion: daysAgo(1).slice(0, 10),
    technician: "Imran Shaikh",
    status: "Ready for Pickup",
    notes: [
      { id: "n1", date: daysAgo(10), author: "Front Desk", text: "Bag received." },
      {
        id: "n2",
        date: daysAgo(4),
        author: "Imran Shaikh",
        text: "Replacement wheel ordered from the parts bin, fitted and tested.",
      },
      {
        id: "n3",
        date: daysAgo(1),
        author: "Front Desk",
        text: "Ready for pickup. SMS sent to customer.",
      },
    ],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1),
  },
  {
    id: "FMB-1003",
    customerName: "Divya Menon",
    phone: "9876543210",
    email: "divya.menon@example.com",
    bagType: "Tote Bag",
    bagBrand: "Bag Co. Weekender",
    bagTag: "BC-WK-77310",
    issue: "Handle has torn away from the body on one side.",
    dropOffDate: daysAgo(1).slice(0, 10),
    status: "Received",
    notes: [
      {
        id: "n1",
        date: daysAgo(1),
        author: "Front Desk",
        text: "Bag received and photographed. Waiting to be assigned to a technician.",
      },
    ],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "FMB-1004",
    customerName: "Karthik Iyer",
    phone: "9012345678",
    bagType: "Laptop Backpack",
    bagBrand: "Bag Co. Voyager",
    bagTag: "BC-VY-33109",
    issue: "Lining torn, loose thread near the laptop sleeve.",
    dropOffDate: daysAgo(20).slice(0, 10),
    estimatedCompletion: daysAgo(14).slice(0, 10),
    technician: "Fathima Begum",
    status: "Returned",
    notes: [
      { id: "n1", date: daysAgo(20), author: "Front Desk", text: "Bag received." },
      {
        id: "n2",
        date: daysAgo(16),
        author: "Fathima Begum",
        text: "Lining replaced and reinforced near the sleeve.",
      },
      {
        id: "n3",
        date: daysAgo(13),
        author: "Front Desk",
        text: "Picked up by customer. Case closed.",
      },
    ],
    createdAt: daysAgo(20),
    updatedAt: daysAgo(13),
  },
];
