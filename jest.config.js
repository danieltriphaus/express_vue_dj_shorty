module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  moduleNameMapper: {
    "^config(.*)$": "<rootDir>/src/config$1"
  }
};
