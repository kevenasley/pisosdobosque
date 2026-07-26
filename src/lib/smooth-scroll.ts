/**
 * Custom rAF-based smooth scroll to an element by id.
 *
 * Avoids relying on `scroll-behavior: smooth` (which can be intercepted by
 * SPA routers and preview iframes) and gives us fine-grained control over
 * duration + easing across browsers.
 */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// easeOutQuint — matches cubic-bezier(0.22, 1, 0.36, 1) feel
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

export function smoothScrollTo(
  target: string | HTMLElement,
  options: { offset?: number; duration?: number } = {},
) {
  if (typeof window === "undefined") return;

  const el =
    typeof target === "string"
      ? document.getElementById(target.replace(/^#/, ""))
      : target;
  if (!el) return;

  const headerOffset = options.offset ?? 72; // sticky header height
  const rect = el.getBoundingClientRect();
  const destination = Math.max(
    0,
    window.scrollY + rect.top - headerOffset,
  );

  if (prefersReducedMotion()) {
    window.scrollTo(0, destination);
    return;
  }

  const start = window.scrollY;
  const change = destination - start;
  const duration = options.duration ?? 650;
  const startTime = performance.now();

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeOutQuint(progress);
    window.scrollTo(0, start + change * eased);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Click handler for in-page anchor links. Use on `<a href="#foo">`.
 * Falls back to native navigation if the id isn't found.
 */
export function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  onDone?: () => void,
) {
  if (!href.startsWith("#")) return;
  const id = href.slice(1);
  const el = id ? document.getElementById(id) : null;
  if (!el && id !== "top") return;
  e.preventDefault();
  if (id === "top" && !el) {
    if (prefersReducedMotion()) window.scrollTo(0, 0);
    else {
      const start = window.scrollY;
      const startTime = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - startTime) / 650);
        window.scrollTo(0, start * (1 - easeOutQuint(p)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  } else if (el) {
    smoothScrollTo(el);
  }
  history.replaceState(null, "", href);
  onDone?.();
}
