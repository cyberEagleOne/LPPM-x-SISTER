import { ALL_ROLES, type UserRole } from "../context/AuthContext";
import { menuConfig, type MenuItem } from "./menuConfig";

interface RouteAccessRule {
  path: string;
  roles: UserRole[];
}

function normalizePath(pathname: string): string {
  const withoutQuery = pathname.split("?")[0].split("#")[0];
  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery;
}

function dedupeRoles(roles: UserRole[]): UserRole[] {
  return Array.from(new Set(roles));
}

function collectMenuRoutes(items: MenuItem[]): RouteAccessRule[] {
  const routes: RouteAccessRule[] = [];

  for (const item of items) {
    if (item.path) {
      routes.push({ path: item.path, roles: item.roles });
    }

    if (item.children?.length) {
      for (const child of item.children) {
        if (child.path) {
          routes.push({ path: child.path, roles: child.roles });
        }
      }
    }
  }

  return routes;
}

function getRolesByMenuKey(key: string): UserRole[] {
  for (const item of menuConfig) {
    if (item.key === key) return item.roles;
    if (item.children) {
      const child = item.children.find((c) => c.key === key);
      if (child) return child.roles;
    }
  }
  return [];
}

const extraRouteAccess: RouteAccessRule[] = [
  // Global authenticated pages.
  { path: "/admin/profile", roles: ALL_ROLES },
  { path: "/admin/403", roles: ALL_ROLES },
  { path: "/admin/419", roles: ALL_ROLES },
  { path: "/admin/500", roles: ALL_ROLES },
  // Parent routes rendered by the same page components.
  { path: "/admin/hibah", roles: getRolesByMenuKey("hibah-internal") },
  { path: "/admin/laporan-kegiatan", roles: getRolesByMenuKey("laporan-kegiatan") },
  { path: "/admin/laporan-publikasi", roles: getRolesByMenuKey("laporan-publikasi") },
  // Detail pages that don't exist in menu configuration directly.
  { path: "/admin/users/:id", roles: getRolesByMenuKey("users") },
];

const routeAccessMap = new Map<string, UserRole[]>();

for (const rule of [...collectMenuRoutes(menuConfig), ...extraRouteAccess]) {
  const path = normalizePath(rule.path);
  const existing = routeAccessMap.get(path) ?? [];
  routeAccessMap.set(path, dedupeRoles([...existing, ...rule.roles]));
}

export function getAllowedRolesForAdminPath(pathname: string): UserRole[] | null {
  const path = normalizePath(pathname);
  if (!path.startsWith("/admin")) {
    return null;
  }

  // Exact match first
  if (routeAccessMap.has(path)) {
    return routeAccessMap.get(path)!;
  }

  // Dynamic route matching (e.g., /admin/users/:id matches /admin/users/123)
  for (const [routePattern, roles] of routeAccessMap.entries()) {
    if (routePattern.includes("/:")) {
      const basePattern = routePattern.split("/:")[0];
      if (path.startsWith(basePattern + "/")) {
        return roles;
      }
    }
  }

  return null;
}

export function canAccessAdminPath(role: UserRole, pathname: string): boolean {
  const allowedRoles = getAllowedRolesForAdminPath(pathname);
  if (!allowedRoles) {
    // Let unknown routes fall through to admin 404.
    return true;
  }

  return allowedRoles.includes(role);
}
