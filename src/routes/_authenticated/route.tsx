import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/admin/login" });
    const isAdmin = await isUserAdmin(user);
    if (!isAdmin) throw redirect({ to: "/admin/login" });
    return { user };
  },
  component: () => <Outlet />,
});
