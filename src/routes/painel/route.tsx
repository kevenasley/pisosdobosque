import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/painel")({
  component: () => <Outlet />,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex,nofollow" },
      { title: "Painel de Marketing | Pisos do Bosque" },
    ],
  }),
});
