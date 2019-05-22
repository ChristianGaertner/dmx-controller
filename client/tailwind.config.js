const { colors, borderRadius } = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    extend: {
      colors: {
        black: "#121212",
        gray: {
          ...colors.gray,
          1000: "#060617"
        },
        green: {
          ...colors.green,
          1000: "#172f20"
        },
        red: {
          ...colors.red,
          1000: "#421e1e"
        },
        orange: {
          ...colors.orange,
          1000: "#57311a"
        },
        blue: {
          ...colors.blue,
          1000: "#1c2238"
        }
      },
      borderRadius: {
        ...borderRadius,
        xl: "1rem"
      }
    }
  },
  variants: {}
};
