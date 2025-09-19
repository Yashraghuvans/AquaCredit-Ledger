import { Role, User } from "@/data/mockData";

export const canAccessUsersPage = (role: Role) => role === "super-admin";
export const canReviewSubmissions = (role: Role) => role === "super-admin" || role === "admin";
export const canCreateSubmission = (role: Role) => role === "manager" || role === "admin" || role === "super-admin";

export const isManagerOf = (manager: User, adminId?: number) => manager.role === "manager" && manager.adminId === adminId;
