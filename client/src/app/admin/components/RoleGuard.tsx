import { type ReactNode } from "react";
import { useAuth, type UserRole } from "../context/AuthContext";
import { resolveRoleTemplate } from "../config/roleTemplates";
import { Error403 } from "../pages/ErrorPages";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) return null;

  const templateRole = resolveRoleTemplate(user.role);
  if (!allowedRoles.includes(templateRole)) {
    return <Error403 />;
  }

  return <>{children}</>;
}
