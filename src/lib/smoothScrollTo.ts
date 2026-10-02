export const smoothScrollTo = (targetId: string) => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const id = targetId.replace("#", "");
  const behavior: ScrollBehavior = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches
    ? "auto"
    : "smooth";

  if (!id || id === "top") {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  document.getElementById(id)?.scrollIntoView({
    behavior,
    block: "start",
  });
};
