// tailwind.config.ts
export default {
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#7B61FF",
                    hover: "#6B51EF",
                    light: "#C084FC",
                    surface: "#F3F0FF",
                },
            },
            borderRadius: {
                "2xl": "1rem",
                "3xl": "1.5rem",
                "4xl": "2rem",
            },
            boxShadow: {
                "purple-glow": "0 8px 32px rgba(123, 97, 255, 0.3)",
                "card": "0 4px 20px rgba(0, 0, 0, 0.06)",
            },
            backgroundImage: {
                "primary-gradient": "linear-gradient(135deg, #7B61FF 0%, #C084FC 100%)",
                "card-gradient": "linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)",
            },
        },
    },
};