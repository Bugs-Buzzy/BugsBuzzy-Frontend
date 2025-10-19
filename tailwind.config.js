/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Renamed: primary (blue scale) & secondary (orange scale)
        primary: {
          columbia: '#CEEDF7',
          nonphoto: '#A6DEF2',
          sky: '#7DCEEC',
          aero: '#56C0E6',
          process: '#2EB1E0',
          cerulean: '#17789B',
          midnight: '#0B3A4B',
          oxfordblue: '#0B1F47',
        },
        secondary: {
          golden: '#F14F04',
          orangePantone: '#FB5D13',
          orangeCrayola: '#FC7738',
          ramzinex: '#FAA61A',
        },
      },
      fontFamily: {
        pixel: ['"Pixelify Sans"', '"Unixel"', 'monospace'],
        normal: ['"Comic Sans MS"', '"Comic Sans"', '"IRANSansX"', 'Tahoma', 'Arial', 'sans-serif'],
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': {
            textShadow:
              '0 0 10px #2EB1E0,0 0 20px #2EB1E0,0 0 30px #56C0E6,0 0 40px #56C0E6,0 0 50px #7DCEEC,0 0 60px #7DCEEC,0 0 70px #A6DEF2',
          },
          '100%': {
            textShadow:
              '0 0 20px #17789B,0 0 30px #2EB1E0,0 0 40px #56C0E6,0 0 50px #7DCEEC,0 0 60px #A6DEF2,0 0 70px #CEEDF7,0 0 80px #CEEDF7',
          },
        },
      },
    },
  },
  plugins: [],
};
