module.exports = {
  overrides: [
    {
      files: ["*.vue", "*.js"],
      options: {
        trailingComma: "none",
        tabWidth: 2,
        semi: false,
        singleQuote: true,
        arrowParens: "always"
      }
    }
  ]
};
