/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  collectCoverageFrom: ["src/components/**/*.{ts,tsx}", "src/screens/**/*.{ts,tsx}"],
};
