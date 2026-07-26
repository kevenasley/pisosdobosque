export const smoothScrollTo = (targetId: string) => {
  const id = targetId.replace('#', '');
  if (typeof document === 'undefined') return;
  const element = id ? document.getElementById(id) : null;
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (id === 'top' || id === '') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
