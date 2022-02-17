const colors = require("tailwindcss/colors");

colors["primary"] = "var(--color-primary)";
colors["secondary"] = "var(--color-secondary)";
colors["tertiary"] = "var(--color-tertiary)";

module.exports = {
    content: [
        "./app/**/*.tsx",
        "./app/**/*.html",
    ],
    variants: {
        extend: {
            backgroundColor: ["active"],
        },
    },
};
