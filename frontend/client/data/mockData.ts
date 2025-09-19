export type Role = "super-admin" | "admin" | "manager";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  teamId: number | null;
  adminId?: number;
}

export interface Submission {
  id: number;
  projectId: string;
  submittedBy: number; // user id (manager)
  adminId: number; // admin overseeing
  date: string; // ISO date
  status: "Pending" | "Verified" | "Rejected";
  imageUrl: string;
  location: string;
}

export interface BlockchainLog {
  id: string;
  hash: string;
  user: string; // display name
  activity: string;
  timestamp: string; // ISO datetime
  creditsMinted: number;
}

export const users: User[] = [
  { id: 1, name: "Dr. Evelyn Reed", email: "evelyn.reed@nccr.gov", role: "super-admin", teamId: null },
  { id: 2, name: "Sameer Sharma", email: "sameer.sharma@nccr.gov", role: "admin", teamId: 101 },
  { id: 3, name: "Priya Patel", email: "priya.patel@nccr.gov", role: "admin", teamId: 102 },
  { id: 4, name: "Arjun Das", email: "arjun.das@field.org", role: "manager", teamId: 101, adminId: 2 },
  { id: 5, name: "Sunita Rao", email: "sunita.rao@field.org", role: "manager", teamId: 101, adminId: 2 },
  { id: 6, name: "Raj Kumar", email: "raj.kumar@field.org", role: "manager", teamId: 102, adminId: 3 },
  { id: 7, name: "Isha Singh", email: "isha.singh@field.org", role: "manager", teamId: 102, adminId: 3 },
];

export const submissions: Submission[] = [
  { id: 1001, projectId: "MNG-001", submittedBy: 4, adminId: 2, date: "2025-09-18", status: "Verified", imageUrl: "https://images.unsplash.com/photo-1590683054069-802d291901a8", location: "Sunderbans" },
  { id: 1002, projectId: "MNG-002", submittedBy: 5, adminId: 2, date: "2025-09-17", status: "Pending", imageUrl: "https://images.unsplash.com/photo-1518457607822-0a5688514781", location: "Pichavaram" },
  { id: 1003, projectId: "CRL-003", submittedBy: 6, adminId: 3, date: "2025-09-16", status: "Rejected", imageUrl: "https://images.unsplash.com/photo-1622645629431-7741dc56396c", location: "Gulf of Mannar" },
  { id: 1004, projectId: "MNG-004", submittedBy: 4, adminId: 2, date: "2025-09-15", status: "Verified", imageUrl: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4", location: "Bhitarakanika" },
  { id: 1005, projectId: "CRL-005", submittedBy: 5, adminId: 2, date: "2025-09-14", status: "Pending", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e", location: "Muthupet" },
  { id: 1006, projectId: "MNG-006", submittedBy: 6, adminId: 3, date: "2025-09-13", status: "Verified", imageUrl: "https://images.unsplash.com/photo-1455216279377-5f1e1bcd9879", location: "Aghanashini" },
  { id: 1007, projectId: "CRL-007", submittedBy: 7, adminId: 3, date: "2025-09-12", status: "Pending", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", location: "Chilika" },
  { id: 1008, projectId: "MNG-008", submittedBy: 5, adminId: 2, date: "2025-09-11", status: "Rejected", imageUrl: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc", location: "Rann of Kutch" },
  { id: 1009, projectId: "CRL-009", submittedBy: 4, adminId: 2, date: "2025-09-10", status: "Verified", imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21", location: "Vembanad" },
  { id: 1010, projectId: "MNG-010", submittedBy: 6, adminId: 3, date: "2025-09-09", status: "Pending", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e", location: "Pamban" },
  { id: 1011, projectId: "CRL-011", submittedBy: 7, adminId: 3, date: "2025-09-08", status: "Verified", imageUrl: "https://images.unsplash.com/photo-1493558103817-58b2924bce98", location: "Lakshadweep" },
  { id: 1012, projectId: "MNG-012", submittedBy: 5, adminId: 2, date: "2025-09-07", status: "Rejected", imageUrl: "https://images.unsplash.com/photo-1522877935258-2c6f7534b5f2", location: "Andaman" },
  { id: 1013, projectId: "CRL-013", submittedBy: 4, adminId: 2, date: "2025-09-06", status: "Pending", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e", location: "Sundarbans East" },
  { id: 1014, projectId: "MNG-014", submittedBy: 6, adminId: 3, date: "2025-09-05", status: "Verified", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e", location: "Godavari" },
  { id: 1015, projectId: "CRL-015", submittedBy: 7, adminId: 3, date: "2025-09-04", status: "Verified", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", location: "Mahanadi" },
  { id: 1016, projectId: "MNG-016", submittedBy: 5, adminId: 2, date: "2025-09-03", status: "Pending", imageUrl: "https://images.unsplash.com/photo-1455216279377-5f1e1bcd9879", location: "Coringa" },
  { id: 1017, projectId: "CRL-017", submittedBy: 4, adminId: 2, date: "2025-09-02", status: "Rejected", imageUrl: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4", location: "Pulicat" },
  { id: 1018, projectId: "MNG-018", submittedBy: 6, adminId: 3, date: "2025-09-01", status: "Verified", imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21", location: "Kori Creek" },
  { id: 1019, projectId: "CRL-019", submittedBy: 7, adminId: 3, date: "2025-08-31", status: "Pending", imageUrl: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc", location: "Pichavaram West" },
  { id: 1020, projectId: "MNG-020", submittedBy: 4, adminId: 2, date: "2025-08-30", status: "Verified", imageUrl: "https://images.unsplash.com/photo-1493558103817-58b2924bce98", location: "Sunderbans North" },
];

export const blockchainLogs: BlockchainLog[] = [
  { id: "tx_01", hash: "0x1a2b3c...", user: "Sameer Sharma", activity: "Verified Submission #1001", timestamp: "2025-09-18T10:00:00Z", creditsMinted: 50 },
  { id: "tx_02", hash: "0x4d5e6f...", user: "Priya Patel", activity: "Rejected Submission #1003", timestamp: "2025-09-17T11:30:00Z", creditsMinted: 0 },
  { id: "tx_03", hash: "0x7a8b9c...", user: "Dr. Evelyn Reed", activity: "Minted 120 Credits (Batch)", timestamp: "2025-09-18T14:40:00Z", creditsMinted: 120 },
  { id: "tx_04", hash: "0x9d0e1f...", user: "Sameer Sharma", activity: "Queued Verification #1005", timestamp: "2025-09-17T18:20:00Z", creditsMinted: 0 },
  { id: "tx_05", hash: "0x2a3b4c...", user: "Priya Patel", activity: "Verified Submission #1014", timestamp: "2025-09-15T09:10:00Z", creditsMinted: 45 },
];
