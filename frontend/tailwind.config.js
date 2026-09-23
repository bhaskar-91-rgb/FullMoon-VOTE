/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        glass: {
          border: 'rgba(255, 255, 255, 0.1)',
          bg: 'rgba(15, 23, 42, 0.45)', // Darker, transparent slate
          bgHover: 'rgba(30, 41, 59, 0.55)',
          darkText: '#f8fafc',
          mutedText: '#94a3b8'
        },
        accent: {
          primary: '#8b5cf6',   // Violet 500
          secondary: '#ec4899', // Pink 500
          yes: '#10b981',       // Emerald 500
          no: '#f43f5e',        // Rose 500
        }
      },
      fontFamily: {
        display: ['"Outfit"', 'ui-sans-serif', 'system-ui'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 40px -8px rgba(139, 92, 246, 0.5)',
        glowYes: '0 0 20px -5px rgba(16, 185, 129, 0.4)',
        glowNo: '0 0 20px -5px rgba(244, 63, 94, 0.4)',
      },
      backgroundImage: {
        'dark-mesh': 'radial-gradient(at 0% 0%, hsla(253,86%,17%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,89%,18%,1) 0, transparent 50%), radial-gradient(at 100% 100%, hsla(186,89%,16%,1) 0, transparent 50%), radial-gradient(at 0% 100%, hsla(225,89%,18%,1) 0, transparent 50%)',
      },
      animation: {
        'blob': 'blob 10s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
