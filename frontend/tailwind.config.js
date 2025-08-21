/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // 101 Cookbooks inspired palette
                'cookbook': {
                    50: '#faf8f5',   // Warm off-white
                    100: '#f5f1eb',  // Light cream
                    200: '#ede6db',  // Soft beige
                    300: '#e0d4c4',  // Warm beige
                    400: '#d1c0a8',  // Medium tan
                    500: '#b8a086',  // Warm brown
                    600: '#9d8268',  // Deep tan
                    700: '#7d6651',  // Rich brown
                    800: '#5c4a3a',  // Dark brown
                    900: '#3d2f23',  // Deep chocolate
                },
                'sage': {
                    50: '#f6f7f6',
                    100: '#e8ebe8',
                    200: '#d1d7d1',
                    300: '#a8b5a8',
                    400: '#7a8e7a',
                    500: '#5a6e5a',
                    600: '#475847',
                    700: '#3a463a',
                    800: '#2f382f',
                    900: '#252b25',
                }
            },
            fontFamily: {
                'serif': ['Crimson Text', 'Georgia', 'serif'],
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'display': ['Playfair Display', 'Georgia', 'serif'],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
            },
            letterSpacing: {
                'tighter': '-0.05em',
                'tight': '-0.025em',
                'normal': '0em',
                'wide': '0.025em',
                'wider': '0.05em',
                'widest': '0.1em',
            }
        },
    },
    plugins: [],
}