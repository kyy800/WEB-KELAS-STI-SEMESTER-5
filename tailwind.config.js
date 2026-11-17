import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                ink: {
                    DEFAULT: '#0b1020',
                    700: '#1b2540',
                    800: '#121a2e',
                    900: '#0b1020',
                    950: '#070b16',
                },
                parchment: {
                    DEFAULT: '#f6f1e8',
                    50: '#fbf8f1',
                    100: '#f6f1e8',
                    200: '#ece2d2',
                    300: '#ddceb8',
                },
                dawn: '#6d8cff',
                dusk: '#e8a15f',
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                display: [
                    '"Instrument Serif"',
                    'Newsreader',
                    '"Iowan Old Style"',
                    '"Palatino Linotype"',
                    'Palatino',
                    'Georgia',
                    'serif',
                ],
            },
        },
    },

    plugins: [forms],
};
