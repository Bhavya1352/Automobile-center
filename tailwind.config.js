export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#10b981", // Emerald 500
                secondary: "#0a0a0a", // Obsidian Black
                accent: "#fbbf24", // Amber 400
                "bg-main": "#000000",
                "card-bg": "rgba(255, 255, 255, 0.03)",
            },
            fontFamily: {
                outfit: ["Outfit", "sans-serif"],
                inter: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
}
