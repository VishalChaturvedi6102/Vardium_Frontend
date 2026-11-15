// Below the `lg` breakpoint (1024 px) calculators show form and result as separate screens.
export const isBelowDesktopViewport = (): boolean =>
  window.matchMedia('(max-width: 1023px)').matches
