export const smoothScrollTo = (targetId: string) => {
  const id = targetId.replace('#', '');
  if (typeof document === 'undefined') return;
  
  const element = id ? document.getElementById(id) : null;
  
  // Use Lenis if available on window for maximum smoothness, fallback to native
  const lenis = (window as any).lenis;
  
  if (lenis) {
    if (element) {
      lenis.scrollTo(element, { offset: -80 });
    } else if (id === 'top' || id === '') {
      lenis.scrollTo(0);
    }
  } else {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (id === 'top' || id === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};
