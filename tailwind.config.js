/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Study target: cream paper bg + purple accent + olive/terracotta
        paper: '#faf6ed',
        paperDark: '#f1ebd9',
        ink: '#2e2a3d',
        accent: {
          DEFAULT: '#7c4dff',
          soft: '#ece5ff',
        },
        olive: '#8a9a5b',
        terracotta: '#c06b4a',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"Noto Sans CJK SC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif SC"', '"Noto Serif CJK SC"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
