export default {
  testEnvironment: "jest-environment-jsdom", // Same name of the lib you installed
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // The file you created to extend jest config and "implement" the jest-dom environment in the jest globals
  moduleNameMapper: {
    // '\\.(gif|ttf|eot|png)$': "<rootDir>/__mocks__/svg.js", // The global stub for weird files
    "\\.(css|less|sass|scss)$": "identity-obj-proxy", // The mock for style related files
    "^@/(.*)$": "<rootDir>/src/$1", // [optional] Are you using aliases?
    '\\.svg': '<rootDir>/__mocks__/svg.js'
  },
  // transform: {
  //   "^.+\\.[t|j]sx?$": "babel-jest" , "^.+\\.svg$": "jest-transformer-svg",
  // },

};
