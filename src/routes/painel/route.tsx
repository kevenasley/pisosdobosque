import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardAccessGate } from "@/components/dashboard/DashboardAccessGate";

export const Route = createFileRoute("/painel")({
  component: PainelLayout,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex,nofollow" },
      { title: "Painel de Marketing | Pisos do Bosque" },
    ],
  }),
});

function PainelLayout() {
  return (
    <DashboardAccessGate>
      <Outlet />
    </DashboardAccessGate>
  );
}
