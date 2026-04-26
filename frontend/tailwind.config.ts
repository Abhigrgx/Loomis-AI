import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        bone: '#f4efe8',
        pine: '#1f3b2d',
        ember: '#d45a2a',
        slate: '#1a1e24',
        mist: '#e8ede9'
      },
      boxShadow: {
        glow: '0 12px 40px rgba(212, 90, 42, 0.25)'
      }
    }
  },
  plugins: []
};

export default config;
