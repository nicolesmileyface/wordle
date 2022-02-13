const breakpoints = {
  xxs: 400,
  xs: 500,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1400,
}

module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    queries: Object.fromEntries(Object.entries(breakpoints).map(([key, val]) => [key, `(min-width: ${val}px)`])),
    screens: Object.fromEntries(Object.entries(breakpoints).map(([key, val]) => [key, `${val}px`])),
    extend: {},
  },
  plugins: [],
}
