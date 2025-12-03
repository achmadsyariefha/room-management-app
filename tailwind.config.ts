import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        "./pages/**/*",
        "./components/**/*",
    ],
    theme: {
        extend: {
            zIndex: {
                60: '60',
                70: '70',
            },
        },
    },
    plugins: [],
};

export default config;