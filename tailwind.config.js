export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { cream: '#f8f1e5', champagne: '#e9d8b9', gold: '#b8924a', ink: '#2b2118', cocoa: '#6b5640', sand: '#efe3d0' },
      fontFamily: {
        display: ['"Playfair Display"', '"Noto Serif Bengali"', 'serif'],
        body: ['"Hind Siliguri"', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 18px 50px -20px rgba(80,55,20,.35)' },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'none' } },
        zoomSlow: { '0%': { transform: 'scale(1.12)' }, '100%': { transform: 'scale(1)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        slideIn: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'none' } },
      },
      animation: { fadeUp: 'fadeUp .9s both', zoomSlow: 'zoomSlow 2.4s ease-out both', slideIn: 'slideIn .3s ease-out' },
    },
  },
  plugins: [],
};
