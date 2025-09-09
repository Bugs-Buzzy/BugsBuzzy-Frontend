/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['"Orbitron"', 'sans-serif'],
        roboto: ['"Roboto"', 'sans-serif'],
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': {
            textShadow:
              '0 0 10px #fff,0 0 20px #fff,0 0 30px #f09,0 0 40px #f09,0 0 50px #f09,0 0 60px #f09,0 0 70px #f09',
          },
          '100%': {
            textShadow:
              '0 0 20px #fff,0 0 30px #ff4da6,0 0 40px #ff4da6,0 0 50px #ff4da6,0 0 60px #ff4da6,0 0 70px #ff4da6,0 0 80px #ff4da6',
          },
        },
      },
    },
  },
  plugins: [],
};
