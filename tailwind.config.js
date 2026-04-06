/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "from-orange-100",
    "via-orange-50",
    "from-pink-100",
    "via-pink-50",
    "from-indigo-100",
    "via-indigo-50",
    "from-teal-100",
    "via-teal-50",
    "from-yellow-100",
    "via-yellow-50",
    "from-red-100",
    "via-red-50",
    "from-cyan-100",
    "via-cyan-50",
  ],
};