/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#cd9933", // Gold/Bronze from existing site (approx)
                secondary: "#1f2937",
            },
        },
    },
    plugins: [],
};
