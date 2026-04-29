import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        radar: {
          green: '#22c55e',
          yellow: '#eab308',
          red: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};

export default config;
