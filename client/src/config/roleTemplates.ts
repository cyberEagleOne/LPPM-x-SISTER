import type { UserRole } from "../context/AuthContext";

export type RoleTemplate = "administrator" | "dosen" | "reviewer" | "halaman-umum";

const ROLE_TEMPLATE_MAP: Record<UserRole, RoleTemplate> = {
  administrator: "administrator",
  dosen: "dosen",
  reviewer: "reviewer",
  "halaman-umum": "halaman-umum",
};

export function resolveRoleTemplate(role: UserRole): RoleTemplate {
  return ROLE_TEMPLATE_MAP[role];
}

export function roleMatchesAny(
  role: UserRole | null | undefined,
  allowedTemplates: string[],
): boolean {
  if (!role) return false;
  const template = ROLE_TEMPLATE_MAP[role];
  if (!template) return false;
  return allowedTemplates.includes(template);
}

export function getDefaultAdminLanding(role: UserRole): string {
  if (role === "halaman-umum") {
    return "/";
  }
  if (role === "reviewer") {
    return "/reviewer";
  }
  return "/admin";
}
